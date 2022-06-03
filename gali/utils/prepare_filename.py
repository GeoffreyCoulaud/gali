import re

def prepare_filename(s: str) -> str:
	pattern = re.compile("[^a-zA-Z0-9]")
	return re.sub(pattern, "-", s)