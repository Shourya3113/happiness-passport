import qrcode
import os


def generate_qr_code(uuid: str, verify_url: str, output_dir: str = "uploads/qr") -> str:
    os.makedirs(output_dir, exist_ok=True)
    img = qrcode.make(f"http://localhost:5173{verify_url}")
    path = os.path.join(output_dir, f"{uuid}.png")
    img.save(path)
    return f"/uploads/qr/{uuid}.png"
