npm --prefix frontend install
npm --prefix frontend run build
rm backend/static/{*.js,*.css}
python backend/manage.py collectstatic --noinput
git add backend/static
git commit -m "Deploy"
git push