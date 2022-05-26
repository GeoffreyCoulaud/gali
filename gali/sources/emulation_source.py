from gali.sources.source import Source
from gali.utils.deep_find_files import deep_find_files

class EmulationSource(Source):

	rom_extensions: list[str] = []

	def get_rom_paths(self, rom_dirs, rom_extensions) -> list[str]:
		"""Get path to game roms"""
		paths = []
		for rom_dir in rom_dirs:
			found = []
			try:
				found = deep_find_files(
					rom_dir.path, 
					rom_dir.depth, 
					rom_extensions
				)
			except Exception as err:
				continue
			paths.extend(found)
		return paths