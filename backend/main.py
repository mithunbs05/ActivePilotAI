import os
import uvicorn
import json
import re
import random
import string
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from mock_db import products, orders

# Load environment variables
load_dotenv()

# Configuration
API_KEY = os.getenv("AI_API_KEY")
BASE_URL = os.getenv("AI_BASE_URL")
MODEL_NAME = os.getenv("AI_MODEL_NAME", "gpt-4.1-nano")

# Initialize OpenAI Client
client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL
)

# In-memory storage for chat sessions
CHAT_SESSIONS = {}

# In-memory storage for escalations
ESCALATION_DB = {}

app = FastAPI()

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origin like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    message: str

class EscalationRequest(BaseModel):
    session_id: str
    history: list
    reason: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Retrieve or initialize session history
        if request.session_id not in CHAT_SESSIONS:
            system_instruction = f"""
You are the TechNova Sales Agent. 

1. PRODUCT CATALOG: Use this data to recommend products.
{json.dumps(products)}

2. USER ORDERS: Use this data to answer "Where is my order?" questions.
{json.dumps(orders)}

You MUST return your response in this strict JSON format:
{{
  "message": "Your helpful text response goes here...",
  "action": "ESCALATE" | "NAVIGATE" | "NONE",
  "payload": "/product/{{id}}" | null
}}

RULES:
1. Analyze the user's sentiment.
2. If the user is ANGRY, FRUSTRATED, or asks for a "HUMAN" / "PERSON" / "AGENT":
   Set "action": "ESCALATE", "payload": null, and "message": "I understand. I am generating a secure support code for you now..."
3. If the user asks to see a product (e.g., "Show me", "Yes", "Open it"), set "action": "NAVIGATE" and "payload": "/product/{{id}}".
4. Otherwise, set "action": "NONE" and "payload": null.
5. Do NOT include markdown links in the "message" field.
6. If the user asks for a specific spec (e.g. "i5 laptop"), find the product ID that matches and recommend it.
7. If the user asks about an order, check the status in the Order list.

CRITICAL RULE:
- Do NOT generate any 4-digit code numbers yourself. 
- Do NOT say "Call 1-800...". 
- ONLY say you are generating the code. The system will handle the rest.
"""
            CHAT_SESSIONS[request.session_id] = [
                {
                    "role": "system", 
                    "content": system_instruction
                }
            ]
        
        # 2. Append User Message
        CHAT_SESSIONS[request.session_id].append({
            "role": "user",
            "content": request.message
        })

        # 3. Call AI with full history
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=CHAT_SESSIONS[request.session_id],
            response_format={ "type": "json_object" } # Force JSON mode if model supports it, else prompt engineering handles it
        )
        
        ai_response_str = response.choices[0].message.content
        
        try:
            ai_data = json.loads(ai_response_str)
            reply_content = ai_data.get("message", "I apologize, but I couldn't generate a response.")
            action = ai_data.get("action", "NONE")
            payload = ai_data.get("payload")
            is_escalated = False

            # Intervention Layer: Handle Escalation
            if action == "ESCALATE":
                # 1. Generate the Code
                secure_code = str(random.randint(1000, 9999))
                
                # 2. Retrieve the FULL history from memory
                current_history = CHAT_SESSIONS.get(request.session_id, [])

                # 3. Analyze for Insights (Agentic Step)
                try:
                  insight_response = client.chat.completions.create(
                      model=MODEL_NAME, # Using the same model for analysis
                      messages=[
                          {"role": "system", "content": "Analyze this chat history. Return a strict JSON object with 3 fields: 'sentiment' (Enum: 'Negative', 'Neutral', 'Positive'), 'summary' (A 1-sentence summary of the user's problem), 'solution' (A recommended solution for the support agent, e.g., 'Offer 10% discount')."},
                          {"role": "user", "content": json.dumps(current_history)}
                      ],
                      response_format={ "type": "json_object" }
                  )
                  insights = json.loads(insight_response.choices[0].message.content)
                except Exception as insight_err:
                  print(f"Error generating insights: {insight_err}")
                  insights = {
                      "sentiment": "Neutral",
                      "summary": "Escalated user request.",
                      "solution": "Review chat history."
                  }

                # 4. Save to Escalation DB (Global Dict)
                ESCALATION_DB[secure_code] = {
                    "session_id": request.session_id,
                    "history": current_history, # The full chat log
                    "reason": insights.get("summary", "Customer Request"), # Using AI summary as reason
                    "insights": insights, # Storing full insights
                    "user_name": "John Doe (Mock User)",
                    "user_tier": "Premium",   # Mock tier
                    "timestamp": datetime.datetime.now().isoformat()
                }
                
                # 5. Append Code to the Message
                reply_content += f"\n\nPlease call 1-800-TECH-NOVA and provide Access Code: {secure_code}"
                is_escalated = True

        except json.JSONDecodeError:
            # Fallback if AI fails to return valid JSON
            reply_content = ai_response_str
            action = "NONE"
            payload = None
            is_escalated = False

        # 4. Append AI Response to history (store the text part)
        CHAT_SESSIONS[request.session_id].append({
            "role": "assistant",
            "content": ai_response_str # Storing the full JSON string to keep context consistent
        })

        return {
            "reply": reply_content, # Sending extracted text to frontend to match existing API contract
            "action": action,
            "payload": payload,
            "is_escalated": is_escalated
        }
    
    except Exception as e:
        print(f"Error calling AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/escalate")
async def escalate_endpoint(request: EscalationRequest):
    try:
        # Generate 4-digit code
        access_code = ''.join(random.choices(string.digits, k=4))
        
        # Store escalation data
        ESCALATION_DB[access_code] = {
            "session_id": request.session_id,
            "history": request.history,
            "reason": request.reason,
            "user_name": "John Doe",  # Mock user (can be fetched from session context)
            "user_tier": "Premium"     # Mock tier
        }
        
        return {"access_code": access_code}
    except Exception as e:
        print(f"Error escalating session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/retrieve/{code}")
async def retrieve_escalation(code: str):
    try:
        if code not in ESCALATION_DB:
            return {"success": False, "error": "Invalid Code"}
        
        data = ESCALATION_DB[code]
        return {
            "success": True,
            "data": {
                "session_id": data.get("session_id"),
                "history": data.get("history"),
                "reason": data.get("reason"),
                "user_name": data.get("user_name"),
                "user_tier": data.get("user_tier")
            }
        }
    except Exception as e:
        print(f"Error retrieving escalation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
