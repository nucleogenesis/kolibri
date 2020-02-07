import json
import io
import re
import xml.etree.ElementTree as ET

from kolibri.core.content.utils.paths import get_content_storage_file_path

from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import QtiAssessmentSerializer

class QtiAssessment(APIView):
    """
    TODO: Give this a meaningful description...
    and write tests ...
    """

    def get(self, request, content_id):
        tree = ET.parse(get_content_storage_file_path("{}.xml".format(content_id)))
        xml = structure_data_from_tree(tree)
        data = QtiAssessmentSerializer({"assessmentTest" : xml}).data
        return Response(data)

def strip_namespaces(root):
    namespace = ""
    ns_search = re.search('{.*}', root.tag)
    if ns_search:
        namespace = ns_search.group(0)

    root.tag = root.tag.replace(namespace, "")

    for e in root.findall(".//*"):
        e.tag = e.tag.replace(namespace, "")

    return root

## Parsing functions
def structure_data_from_tree(tree):
    """
    Given an string of XML, parse it out to the expected dictionary data model to be sent as JSON to the frontend
    """
    # Get the root asssessmentTest element
    root = strip_namespaces(tree.getroot())

    tree._setroot(load_all_external_files(root))

    return ET.tostring(tree.getroot())

def load_all_external_files(root):
    # testPart is only a child of assessmentTest
    for testPart in root.findall('testPart'):
        # assessment[Item|Section]Refs can be children of any kind of assessmentSection
        # assessmentSectionRefs can be children of testPart or assessmentSection

        # Slap the updated one on the end
        root.append(replace_refs(testPart))
        # Remove the current one
        root.remove(testPart)

    return root

def replace_refs(elem):
    # Process assessmentSections which may parent a *Ref of some kind.
    for section in elem.findall('assessmentSection'):
        assessmentSection = replace_refs(section)
        try:
            elem.append(assessmentSection)
        except:
            import pdb;pdb.set_trace()
        elem.remove(section)

    # Process assessmentSectionRefs which may parent a *Ref of some kind.
    for sectionRef in elem.findall('assessmentSectionRef'):
        # Get the file loaded
        assessmentSectionTree = replace_refs(ET.parse(get_content_storage_file_path(sectionRef.attrib['href'])))
        assessmentSection = strip_namespaces(assessmentSectionTree.getroot())
        # Back of the line refElement!
        try:
            elem.append(assessmentSection)
        except:
            import pdb;pdb.set_trace()
        # Remove the one we're no longer using
        elem.remove(sectionRef)

    # Process assessmentItemRefs
    for itemRef in elem.findall('assessmentItemRef'):
        # Get the file loaded
        try:
            assessmentItemTree = replace_refs(ET.parse(get_content_storage_file_path(itemRef.attrib['href'])))
        except ET.ParseError as e:
            import pdb;pdb.set_trace()
        assessmentItem = strip_namespaces(assessmentItemTree.getroot())
        # Cycle the items - this goes to the back
        try:
            elem.append(assessmentItem)
        except:
            import pdb;pdb.set_trace()
        # Kick out this one we don't need it
        elem.remove(itemRef)

    return elem




