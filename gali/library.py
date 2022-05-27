import sys
from traceback import print_tb

from gali.games.game import Game
from gali.sources.source import Source
from gali.sources.all_sources import all_sources

class Library():
	"""A class representing a multi-source game library"""

	games: list[Game] = []
	sources: list[type[Source]] = []

	def __init__(self, enabled_sources_names: list[str]) -> None:
		"""Create a Library instance
		
		Args: 
			enabled_sources_names : name of the sources that the user wants 
			to scan
		"""
		for klass in all_sources:
			if klass.name in enabled_sources_names:
				self.sources.append(klass)

	def empty(self) -> None:
		self.games.clear()

	def scan(self) -> None:
		"""Scan the library sources"""

		self.empty()

		# Create the ready and awaiting sources
		# Awaiting = List of source classes
		# Ready = List of source instances
		awaiting: list[type[Source]] = []
		ready: list[Source] = []
		klass: type[Source] = None
		for klass in self.sources:
			if klass.game_dependency is not None:
				awaiting.append(klass)
			else:
				instance = klass()
				ready.append(instance)

		# Scan ready sources
		while len(ready) > 0:

			source = ready.pop(0)

			# Scan
			games: list[Game] = list()
			try:
				games = source.scan()
			except Exception as err:
				print(f"Error while scanning {source.name}")
				print_tb(sys.exc_info()[2])
				print(err)
			self.games.extend(games)

			# If some awaiting are unlocked,
			# add them to the ready list
			for klass in awaiting:
				predicate = lambda g: klass.game_dependency.test(g)
				game = next(filter(predicate, games), None)
				if game is None: continue
				ready.append(klass(game))

	def print(self) -> None:
		"""Print the games in the library to stdout"""
		for game in self.games:
			print(f"* {str(game)}")