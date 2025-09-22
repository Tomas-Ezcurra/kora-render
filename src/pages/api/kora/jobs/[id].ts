import { NextApiRequest, NextApiResponse } from "next";
import { jobs } from "../jobs";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (req.method === "GET") {
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid job ID" });
        }

        const job = jobs[id];
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json(job);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
