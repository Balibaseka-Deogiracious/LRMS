#!/usr/bin/env python3
"""
Script to remove an admin (librarian) account
Run: python remove_admin.py
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models import Librarian


def remove_admin():
    """Remove the admin@library.com admin account"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        admin_email = "admin@library.com"
        
        # Find the admin
        admin = db.query(Librarian).filter(
            Librarian.email == admin_email
        ).first()
        
        if not admin:
            print(f"❌ Admin account not found: {admin_email}")
            return
        
        # Delete the admin
        db.delete(admin)
        db.commit()
        
        print(f"✅ Admin account removed successfully!")
        print(f"   Email: {admin_email}")
        print(f"   Name: {admin.full_name}")
        print(f"   ID: {admin.id}")
        
    except Exception as e:
        print(f"❌ Error removing admin: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    remove_admin()
