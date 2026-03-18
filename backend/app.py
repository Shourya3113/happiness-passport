from app import create_app

app = create_app()
```

Make sure this file is saved, then push:
```
git add backend/app.py
git commit -m "fix flask entrypoint for vercel"
git push