git checkout deploy
git fetch
git merge --no-edit origin/master
export DJANGO_SETTINGS_MODULE=config.deploy_settings
npm --prefix frontend install
npm --prefix frontend run build
rm backend/static/{*.js,*.css}
pip install -r backend/requirements.txt
python backend/manage.py collectstatic --noinput
git add backend/static
git commit -m "Deploy"
git push
