from gali.games.game import Game
from gali.sources.dependency import Dependency

class Source():

	name: str = None
	game_class: type[Game] = None
	game_dependency: Dependency = None

	prefer_cache: bool = False

	def __init__() -> None:
		pass

	def scan() -> list[Game]:
		"""Scan the source for games"""
		pass