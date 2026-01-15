import re

def is_b2b_email(email):
    # List of common free email providers to exclude
    free_email_providers = [
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
        "aol.com", "protonmail.com", "icloud.com", "mail.com",
        "zoho.com", "yandex.com"
    ]

    # Simple regex for email validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return False

    domain = email.split('@')[1].lower()

    if domain in free_email_providers:
        return False
    
    # Exclude domains that look like personal blogs or very generic (e.g., .net, .org without specific structure)
    # This is a heuristic and can be refined.
    if any(keyword in domain for keyword in ["personal", "blog", "portfolio"]):
        return False

    return True

def analyze_emails(file_path):
    b2b_emails = []
    try:
        with open(file_path, 'r') as f:
            for line in f:
                email = line.strip()
                if email and is_b2b_email(email):
                    b2b_emails.append(email)
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
    return b2b_emails

if __name__ == "__main__":
    email_file = "emails.txt"
    found_b2b_emails = analyze_emails(email_file)

    if found_b2b_emails:
        print("Identified B2B Emails:")
        for email in found_b2b_emails:
            print(email)
    else:
        print("No B2B emails identified.")
