import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app

app = create_app()
```

Then push:
```
git add backend/wsgi.py
git commit -m "fix import path in wsgi"
git push --force