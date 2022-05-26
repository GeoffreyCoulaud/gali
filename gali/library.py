from gali.sources.all_sources import all_sources

class Library():
	"""A class representing a multi-source game library"""

	games = []
	enabled_sources_names = []

	def __init__(self, enabled_sources_names: list[str]) -> None:
		"""Create a Library instance
		
		Args: 
			enabled_sources_names : name of the sources that the user wants 
			to scan
		"""
		self.enabled_sources_names = enabled_sources_names

	def scan(self) -> None:
		"""Rescan the library sources"""
		# TODO scan sources
		pass

	def print(self) -> None:
		"""Print the games in the library to stdout"""
		for game in self.games:
			print(f"* {str(game)}")