import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import Base, SessionLocal, engine
import app.models as models
import app.security as security


def seed_librarian():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(models.Librarian).filter(models.Librarian.email == "admin@library.com").first()
        if existing:
            print("Librarian already exists")
            return

        hashed_password = security.hash_password("admin123")
        new_librarian = models.Librarian(
            full_name="Balibaseka Deogiracious",
            email="admin@library.com",
            hashed_password=hashed_password,
            is_active=True,
            is_admin=True,
        )
        db.add(new_librarian)
        db.commit()
        print("Librarian added successfully")
    except Exception as e:
        print(f"Error seeding librarian: {e}")
    finally:
        db.close()


def seed_categories():
    """Seed sample book categories"""
    db = SessionLocal()
    try:
        categories = ["Fiction", "Science", "History", "Biography", "Technology", "Self-Help", "Mystery", "Romance"]
        
        for cat_name in categories:
            existing = db.query(models.Category).filter(models.Category.name == cat_name).first()
            if not existing:
                category = models.Category(name=cat_name)
                db.add(category)
        
        db.commit()
        print(f"Categories seeded successfully")
    except Exception as e:
        print(f"Error seeding categories: {e}")
    finally:
        db.close()


def seed_books():
    """Seed sample books"""
    db = SessionLocal()
    try:
        sample_books = [
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "isbn": "978-0-06-112008-4",
                "description": "A classic of modern American literature that has been acclaimed by generations of readers.",
                "publication_year": 1960,
                "total_copies": 5,
                "category": "Fiction"
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "isbn": "978-0-451-52494-2",
                "description": "A dystopian social science fiction novel set in Oceania. The narrative follows Winston Smith.",
                "publication_year": 1949,
                "total_copies": 4,
                "category": "Fiction"
            },
            {
                "title": "A Brief History of Time",
                "author": "Stephen Hawking",
                "isbn": "978-0-553-38016-3",
                "description": "From the Big Bang to Black Holes, explore the mysteries of the universe.",
                "publication_year": 1988,
                "total_copies": 3,
                "category": "Science"
            },
            {
                "title": "The Selfish Gene",
                "author": "Richard Dawkins",
                "isbn": "978-0-19-929114-4",
                "description": "A revolutionary look at evolution and the nature of natural selection.",
                "publication_year": 1976,
                "total_copies": 2,
                "category": "Science"
            },
            {
                "title": "Sapiens",
                "author": "Yuval Noah Harari",
                "isbn": "978-0-06-231609-7",
                "description": "A global history examining how Homo sapiens came to dominate the world.",
                "publication_year": 2011,
                "total_copies": 6,
                "category": "History"
            },
            {
                "title": "Steve Jobs",
                "author": "Walter Isaacson",
                "isbn": "978-1-4516-4853-9",
                "description": "The exclusive biography of the Apple founder based on extensive interviews.",
                "publication_year": 2011,
                "total_copies": 4,
                "category": "Biography"
            },
            {
                "title": "Clean Code",
                "author": "Robert C. Martin",
                "isbn": "978-0-13-235088-4",
                "description": "A handbook of agile software craftsmanship and best practices.",
                "publication_year": 2008,
                "total_copies": 3,
                "category": "Technology"
            },
            {
                "title": "The Seven Habits of Highly Effective People",
                "author": "Stephen R. Covey",
                "isbn": "978-0-684-80957-3",
                "description": "Powerful lessons in personal change and habit formation.",
                "publication_year": 1989,
                "total_copies": 5,
                "category": "Self-Help"
            },
            {
                "title": "The Da Vinci Code",
                "author": "Dan Brown",
                "isbn": "978-0-307-27839-6",
                "description": "A mystery thriller that weaves art history, codes, and ancient secrets.",
                "publication_year": 2003,
                "total_copies": 4,
                "category": "Mystery"
            },
            {
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "isbn": "978-0-14-143951-8",
                "description": "A romantic novel of manners that remains widely read and beloved.",
                "publication_year": 1813,
                "total_copies": 3,
                "category": "Romance"
            }
        ]
        
        for book_data in sample_books:
            # Check if book already exists
            existing = db.query(models.Book).filter(models.Book.isbn == book_data["isbn"]).first()
            if existing:
                print(f"Book '{book_data['title']}' already exists")
                continue
            
            # Create book
            book = models.Book(
                title=book_data["title"],
                author=book_data["author"],
                isbn=book_data["isbn"],
                description=book_data["description"],
                publication_year=book_data["publication_year"],
                total_copies=book_data["total_copies"],
                available_copies=book_data["total_copies"],
                is_available=True
            )
            db.add(book)
            db.flush()
            
            # Link category
            category = db.query(models.Category).filter(models.Category.name == book_data["category"]).first()
            if category:
                book_category = models.BookCategory(book_id=book.id, category_id=category.id)
                db.add(book_category)
        
        db.commit()
        print("Books seeded successfully")
    except Exception as e:
        print(f"Error seeding books: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_librarian()
    seed_categories()
    seed_books()