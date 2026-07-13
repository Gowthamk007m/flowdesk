up:
	docker compose up --build

down:
	docker compose down

restart:
	docker compose down
	docker compose up --build

logs:
	docker compose logs -f

ps:
	docker compose ps

build:
	docker compose build

clean:
	docker compose down -v

