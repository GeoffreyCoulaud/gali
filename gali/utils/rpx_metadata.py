from dataclasses import dataclass
from pathlib import PurePath
from defusedxml.ElementTree import parse as xml_parse
from xml.etree.ElementTree import Element, ElementTree  # nosec B405


def xml_prefix_dict(root: Element, prefix: str):
    """From an XML root node, get text of inner nodes matching a prefix.
    The resulting dict associates unprefixed tag name to text."""
    _dict = dict()
    for element in root.iter():
        if not element.tag.startswith(prefix):
            continue
        key = element.tag.removeprefix(prefix)
        value = element.text
        _dict[key] = value
    return _dict


@dataclass
class RPXMetadata:
    """A class representing metadata for a Wii U .rpx game"""
    title_id: str
    region: str
    long_name: dict[str]
    short_name: dict[str]
    publisher: dict[str]
    image_banner: str
    image_icon: str

    @staticmethod
    def from_rom_path(rom_path: str):
        """Create a RPXMetadata object from a .rpx rom path"""

        # Get path to meta.xml
        rom_pure_path = PurePath(rom_path)
        game_root_dir = rom_pure_path.parent.parent
        meta_dir = f"{game_root_dir}/meta"
        meta_xml_path = f"{meta_dir}/meta.xml"

        # Read meta.xml
        xml: ElementTree = xml_parse(meta_xml_path)
        xml_root = xml.getroot()

        # Build metadata
        metadata = RPXMetadata(
            title_id=xml.findtext("menu/title_id", default=None),
            region=xml.findtext("menu/region", default=None),
            long_name=xml_prefix_dict(xml_root, "longname_"),
            short_name=xml_prefix_dict(xml_root, "shortname_"),
            publisher=xml_prefix_dict(xml_root, "publisher_"),
            image_banner=f"{meta_dir}/bootTvTex.tga",
            image_icon=f"{meta_dir}/iconTex.tga"
        )
        return metadata
