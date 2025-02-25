import cuvs from "./chinese_union_simp.json";
import cuvt from "./chinese_union_trad.json";
import kjv from "./kjv.json";
import asv from "./asv.json";
import web from "./web.json";

import abbreviations from "./abbreviations.json";
import bookInd from "./book_ind.json";
import siNames from "./si_names.json";
import trNames from "./tr_names.json";
import enNames from "./en_names.json";

const bible = {
    cuvs: cuvs,
    cuvt: cuvt,
    kjv: kjv,
    asv: asv,
    web: web,
};

const siDict = {};
const trDict = {};
const enDict = {};
for (const key in bookInd) {
    siDict[key] = siNames[bookInd[key]] + " ";
    trDict[key] = trNames[bookInd[key]] + " ";
    enDict[key] = enNames[bookInd[key]] + " ";
}

export default bible;
export { abbreviations, siDict, trDict, enDict };
