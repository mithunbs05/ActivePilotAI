from database import get_db

with get_db() as (conn, cursor, is_pg):
    if is_pg:
        # PostgreSQL: Query information_schema
        cursor.execute("""
            SELECT table_name, 
                   (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
            FROM information_schema.tables t
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        print("\n📊 PostgreSQL Tables:\n")
        print(f"{'Table Name':<30} {'Columns':<10}")
        print("-" * 40)
        for row in cursor.fetchall():
            print(f"{row['table_name']:<30} {row['column_count']:<10}")
        
        # Show detailed schema for each table
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        tables = [r['table_name'] for r in cursor.fetchall()]
        
        print("\n\n📋 Detailed Schema:\n")
        for table in tables:
            cursor.execute(f"""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = %s
                ORDER BY ordinal_position
            """, (table,))
            
            print(f"\n🗂️  {table.upper()}")
            print("-" * 80)
            print(f"{'Column':<25} {'Type':<20} {'Nullable':<10} {'Default':<20}")
            print("-" * 80)
            for col in cursor.fetchall():
                default = str(col['column_default'])[:18] if col['column_default'] else ''
                print(f"{col['column_name']:<25} {col['data_type']:<20} {col['is_nullable']:<10} {default:<20}")
            
            # Count rows
            cursor.execute(f"SELECT COUNT(*) as cnt FROM {table}")
            count = cursor.fetchone()['cnt']
            print(f"\n📊 Total rows: {count}")
    else:
        # SQLite
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        print("\n📊 SQLite Tables:\n")
        for row in cursor.fetchall():
            print(f"  - {row[0]}")
