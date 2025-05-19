import RelativeChildrenDTO from "./RelativeChildrenDTO";
import RelativeDTO from "./RelativeDTO";
import RelativeDetDTO from "./RelativeDetDTO";

interface RelativeCombineDTO {
    relativeDTO: RelativeDTO;
    relativeDetDTOS: RelativeDetDTO[];
    relativeChildrenDTOS: RelativeChildrenDTO[];
  }
export default RelativeCombineDTO;