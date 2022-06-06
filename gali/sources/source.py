from gali.games.game import Game
from gali.sources.dependency import Dependency

class Source():

	name: str = None
	game_class: type[Game] = None
	prefer_cache: bool = False

	def __init__(self) -> None:
		pass

	def scan(self) -> list[Game]:
		"""Scan the source for games"""
		pass