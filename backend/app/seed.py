import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import Base, SessionLocal, engine
import app.models as models
import app.security as security

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


def generate_book_cover(title: str, author: str, book_id: int, color: tuple = (100, 120, 180)) -> str | None:
    """Generate a simple book cover image and save it. Returns cover_filename if successful."""
    if not HAS_PIL:
        return None
    
    try:
        storage_dir = Path(__file__).resolve().parents[2] / "storage" / "book_files"
        storage_dir.mkdir(parents=True, exist_ok=True)
        
        # Create image with dimensions typical of book covers (300x450)
        width, height = 300, 450
        img = Image.new('RGB', (width, height), color=color)
        draw = ImageDraw.Draw(img)
        
        # Try to use a nice font, fall back to default if not available
        try:
            title_font = ImageFont.truetype("arial.ttf", 20)
            author_font = ImageFont.truetype("arial.ttf", 14)
        except:
            title_font = ImageFont.load_default()
            author_font = ImageFont.load_default()
        
        # Add decorative border
        border_color = (max(0, color[0]-30), max(0, color[1]-30), max(0, color[2]-30))
        draw.rectangle([10, 10, width-10, height-10], outline=border_color, width=3)
        
        # Add title (wrap text if needed)
        title_lines = []
        words = title.split()
        current_line = ""
        for word in words:
            test_line = current_line + " " + word if current_line else word
            if len(test_line) > 20:
                if current_line:
                    title_lines.append(current_line)
                current_line = word
            else:
                current_line = test_line
        if current_line:
            title_lines.append(current_line)
        
        # Draw title centered
        y_offset = 100
        for line in title_lines[:3]:
            bbox = draw.textbbox((0, 0), line, font=title_font)
            text_width = bbox[2] - bbox[0]
            x = (width - text_width) // 2
            draw.text((x, y_offset), line, fill=(255, 255, 255), font=title_font)
            y_offset += 35
        
        # Draw author at bottom
        author_bbox = draw.textbbox((0, 0), author, font=author_font)
        author_width = author_bbox[2] - author_bbox[0]
        author_x = (width - author_width) // 2
        draw.text((author_x, height - 80), author, fill=(200, 200, 200), font=author_font)
        
        # Save image
        cover_filename = f"{book_id}_cover.png"
        cover_path = storage_dir / cover_filename
        img.save(cover_path, 'PNG')
        
        return cover_filename
    except Exception as e:
        print(f"Error generating cover for book {book_id}: {e}")
        return None





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
    
    # Color palette for different categories
    category_colors = {
        "Fiction": (220, 80, 100),       # Red
        "Science": (80, 150, 220),       # Blue
        "History": (150, 100, 60),       # Brown
        "Biography": (100, 60, 150),     # Purple
        "Technology": (60, 150, 100),    # Green
        "Self-Help": (220, 180, 60),     # Gold
        "Mystery": (80, 80, 100),        # Dark Blue-Gray
        "Romance": (220, 100, 180),      # Pink
    }
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
            
            # Generate and save cover image
            cover_color = category_colors.get(book_data["category"], (100, 100, 150))
            cover_filename = generate_book_cover(book_data["title"], book_data["author"], book.id, cover_color)
            if cover_filename:
                book.cover_filename = cover_filename
                db.add(book)
            
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


def remove_student():
    """Remove student Nsubuga Ediger from the database permanently"""
    db = SessionLocal()
    try:
        student = db.query(models.Student).filter(models.Student.full_name == "Nsubuga Ediger").first()
        if student:
            db.delete(student)
            db.commit()
            print(f"Student 'Nsubuga Ediger' removed successfully")
        else:
            print("Student 'Nsubuga Ediger' not found")
    except Exception as e:
        print(f"Error removing student: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_categories()
    seed_books()
    remove_student()