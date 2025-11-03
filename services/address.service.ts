import { http } from "./http";

export type ID = string;

export type DistrictOption = {
    code: ID;
    name: string;
};

export type ProvinceOption = {
    code: ID;
    name: string;
    districts: DistrictOption[];
};

// Third-party endpoints
const OPEN_API_URL = "https://provinces.open-api.vn/api/?depth=2";
const GITHUB_FALLBACK_URL =
    "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json";

// Raw types from sources
export type OpenApiProvince = {
    code: number;
    name: string;
    districts: { code: number; name: string }[];
};

export type GithubProvince = {
    Code: string;
    Name: string;
    Districts: { Code: string; Name: string }[];
};

function normalizeFromOpenApi(rows: OpenApiProvince[]): ProvinceOption[] {
    return rows.map((p) => ({
        code: String(p.code),
        name: p.name,
        districts: (p.districts || []).map((d) => ({
            code: String(d.code),
            name: d.name,
        })),
    }));
}

function normalizeFromGithub(rows: GithubProvince[]): ProvinceOption[] {
    return rows.map((p) => ({
        code: p.Code,
        name: p.Name,
        districts: (p.Districts || []).map((d) => ({ code: d.Code, name: d.Name })),
    }));
}

export async function fetchProvincesWithDistricts(): Promise<ProvinceOption[]> {
    try {
        const data = await http.get<OpenApiProvince[]>(OPEN_API_URL);
        return normalizeFromOpenApi(data);
    } catch {
        // Fallback
        const data2 = await http.get<GithubProvince[]>(GITHUB_FALLBACK_URL);
        return normalizeFromGithub(data2);
    }
}
