from gali.sources.source import Source
from gali.utils.deep_find_files import deep_find_files

class EmulationSource(Source):

	rom_extensions: list[str] = []

	def get_rom_paths(self, rom_dir, rom_extensions) -> list[str]:
		"""Get path to game roms"""
		return deep_find_files(
			rom_dir.path, 
			rom_dir.depth, 
			rom_extensions
		)