#!/usr/bin/env python3
"""
Script to create an admin (librarian) account for testing
Run: python create_admin.py
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models import Librarian
from app.security import hash_password


def create_admin():
    """Create an admin account"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Admin credentials
        admin_email = "admin@gmail.com"
        admin_password = "Admin@123"
        admin_name = "Library Admin"
        
        # Check if admin already exists
        existing_admin = db.query(Librarian).filter(
            Librarian.email == admin_email
        ).first()
        
        if existing_admin:
            print(f"❌ Admin account already exists: {admin_email}")
            print(f"   ID: {existing_admin.id}")
            print(f"   Name: {existing_admin.full_name}")
            print(f"   Admin: {existing_admin.is_admin}")
            return
        
        # Hash the password
        hashed_pwd = hash_password(admin_password)
        
        # Create new admin
        admin = Librarian(
            full_name=admin_name,
            email=admin_email,
            hashed_password=hashed_pwd,
            is_active=True,
            is_admin=True
        )
        
        # Add to database
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("✅ Admin account created successfully!")
        print(f"\n📋 Admin Credentials:")
        print(f"   Email: {admin_email}")
        print(f"   Password: {admin_password}")
        print(f"   Name: {admin_name}")
        print(f"   ID: {admin.id}")
        print(f"\n🔐 Use these credentials to login in the application")
        
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
