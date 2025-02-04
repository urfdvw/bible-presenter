import { getSelectedVersions } from "../bible/utils";

describe("Test getSelectedVersions", () => {
    test("version selection 1", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "中文",
                chinese: "繁體",
            })
        ).toStrictEqual(["cuvt"]);
    });

    test("version selection 1", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "中文",
                chinese: "简体",
            })
        ).toStrictEqual(["cuvs"]);
    });

    test("version selection 1", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "English",
                chinese: "繁體",
            })
        ).toStrictEqual(["ASV"]);
    });

    test("version selection 1", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "English",
                chinese: "简体",
            })
        ).toStrictEqual(["ASV"]);
    });

    test("version selection 1", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "对照",
                chinese: "繁體",
            })
        ).toStrictEqual(["cuvt", "ASV"]);
    });

    test("version selection 1", () => {
        expect(
            getSelectedVersions("cuvs", "cuvt", "ASV", {
                language: "对照",
                chinese: "简体",
            })
        ).toStrictEqual(["cuvs", "ASV"]);
    });
});
