from sqlite3 import connect, Row

from gali.utils.locations import HOME
from gali.sources.source import Source
from gali.games.lutris_game import LutrisGame


class LutrisSource(Source):

    name: str = "Lutris"
    game_class: type[LutrisGame] = LutrisGame

    db_path: str = f"{HOME}/.local/share/lutris/pga.db"
    db_request: str = """
        SELECT
            name, slug, configpath, installed
        FROM
            'games'
        WHERE
            NOT hidden
            AND name IS NOT NULL
            AND slug IS NOT NULL
            AND configPath IS NOT NULL
        ;
    """

    def get_db_contents(self) -> list[Row]:
        connection = connect(self.db_path)
        cursor = connection.execute(self.db_request)
        rows = cursor.fetchall()
        connection.close()
        return rows

    def get_games(self, rows: list[Row]) -> tuple[LutrisGame]:
        games = []
        for row in rows:

            name = row[0]
            game_slug = row[1]
            config_path = row[2]
            is_installed = row[3]

            # Skip broken games
            if (
                name is None or
                game_slug is None or
                config_path is None
            ):
                continue

            game = self.game_class(
                name=name,
                game_slug=game_slug,
                config_path=config_path,
                is_installed=is_installed
            )
            games.append(game)

        return tuple(games)

    def scan(self) -> tuple[LutrisGame]:
        db_rows = self.get_db_contents()
        games = self.get_games(db_rows)
        return games
