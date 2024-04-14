npm --prefix frontend install
npm --prefix frontend run build
python backend/manage.py collectstatic --noinput
git add backend/static
git commit -m "Update static files"
git push