import hashlib
import string
import random

def ensure_complexity(password: str, alphabet:str, special_chars: str) -> str:
    has_special = any(c in special_chars for c in password)
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)

    if not (has_special or has_upper or has_lower or has_digit):
        pw = list(password)
        if not has_special:
            pw[0] = random.choice(string.ascii_letters)
        if not has_upper:
            pw[1] = random.choice(string.ascii_uppercase)
        if not has_lower:
            pw[2] = random.choice(string.ascii_lowercase)
        if not has_digit:
            pw[3] = random.choice(string.digits)
        random.shuffle(pw)
        return ''.join(pw)
    return password

def get_hash(secret: str, service: str, version: int) -> str:
    base_string = f"{secret}:{service}:{version}"
    sha256 = hashlib.sha256(base_string.encode("utf-8")).hexdigest()
    return sha256

def generate_password_from_hash(hash_hex: str, length: int = 32) -> str:
    special_chars = "!@#$%&*"
    alphabet = string.ascii_letters + string.digits
    byte_values = [int(hash_hex[i:i + 2], 16) for i in range(0, len(hash_hex), 2)]

    password_chars = []
    for i, byte in enumerate(byte_values):
        if i % 8 == 0:
            password_chars.append(special_chars[byte % len(special_chars)])
        else:
            password_chars.append(alphabet[byte % len(alphabet)])
    return ensure_complexity(''.join(password_chars)[:length], alphabet, special_chars)

def generate_password(secret: str, service: str, length: int, version: int = 1) -> str:
    if not secret or not service:
        raise ValueError("secret and service are required")
    return generate_password_from_hash(get_hash(secret, service, version), length)