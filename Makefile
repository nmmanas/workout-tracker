run-backend:
	cd backend && npm run dev
run-frontend:
	cd frontend && npm start
build-docker-frontend:
	./build.sh
build-docker-backend:
	docker-compose build backend
build-docker-compose: build-docker-backend build-docker-frontend
run-docker-compose:
	docker-compose --env-file ./backend/.env up
build-and-run-docker-compose: build-docker-compose run-docker-compose
