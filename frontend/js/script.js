
document.addEventListener("DOMContentLoaded", function () {

    const uploadForm = document.getElementById("uploadForm");
    const resumeFiles = document.getElementById("resumeFiles");
    const fileInfo = document.getElementById("fileInfo");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const results = document.getElementById("results");
    const exportBtn = document.getElementById("exportBtn");

    let candidateData = [];

    // FILE SELECTION
    resumeFiles.addEventListener("change", function () {
        const files = resumeFiles.files;

        if (files.length === 0) {
            fileInfo.textContent = "No files selected";
        } else {
            fileInfo.textContent = files.length + " resume(s) selected";
        }
    });

    // FORM SUBMISSION
    uploadForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const jobDescription = document.getElementById("jobDescription").value.trim();
        const files = resumeFiles.files;

        if (!jobDescription) {
            alert("Please enter a job description.");
            return;
        }

        if (files.length === 0) {
            alert("Please select at least one resume.");
            return;
        }

        const formData = new FormData();
        formData.append("job_description", jobDescription);

        for (let i = 0; i < files.length; i++) {
            const extension = files[i].name.split(".").pop().toLowerCase();

            if (!["pdf", "docx"].includes(extension)) {
                alert("Only PDF and DOCX files are supported.");
                return;
            }

            formData.append("resumes", files[i]);
        }

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Analyzing...";
        exportBtn.style.display = "none";

        results.innerHTML = `
            <div class="empty-state">
                <h3>Analyzing resumes...</h3>
                <p>Please wait while TalentIQ processes your candidates.</p>
            </div>
        `;

        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed.");
            }

            candidateData = data.candidates || [];
            displayResults(candidateData);

        } catch (error) {
            candidateData = [];
            exportBtn.style.display = "none";

            results.innerHTML = `
                <div class="empty-state">
                    <h3>Analysis Failed</h3>
                    <p>${escapeHTML(error.message)}</p>
                </div>
            `;

        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = "Analyze Candidates →";
        }
    });

    // DISPLAY RESULTS
    function displayResults(candidates) {

        document.getElementById("totalCandidates").textContent = candidates.length;

        if (!candidates || candidates.length === 0) {
            document.getElementById("averageMatch").textContent = "0%";
            document.getElementById("topMatch").textContent = "0%";

            exportBtn.style.display = "none";

            results.innerHTML = `
                <div class="empty-state">
                    <h3>No valid resumes found</h3>
                    <p>Check your uploaded PDF or DOCX files.</p>
                </div>
            `;
            return;
        }

        const average = candidates.reduce(
            (sum, candidate) => sum + Number(candidate.match_score || 0), 0
        ) / candidates.length;

        document.getElementById("averageMatch").textContent =
            average.toFixed(2) + "%";

        document.getElementById("topMatch").textContent =
            Number(candidates[0].match_score || 0).toFixed(2) + "%";

        exportBtn.style.display = "inline-block";

        let html = `
            <div class="section-heading">
                <h2>Candidate Rankings</h2>
                <p>${candidates.length} candidate(s) analyzed.</p>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Candidate</th>
                            <th>Contact</th>
                            <th>Skills</th>
                            <th>Overall Match</th>
                            <th>Skill Coverage</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        candidates.forEach((candidate, index) => {

            const score = Number(candidate.match_score) || 0;
            const skillScore = Number(candidate.skill_score) || 0;

            html += `
                <tr>
                    <td><strong>#${index + 1}</strong></td>

                    <td>
                        <strong>${escapeHTML(candidate.name || "Not Found")}</strong>
                        <small>${escapeHTML(candidate.filename || "")}</small>
                    </td>

                    <td>${escapeHTML(candidate.email || "Not Found")}</td>

                    <td>${escapeHTML(
                        (candidate.skills || []).join(", ") || "None detected"
                    )}</td>

                    <td>
                        <div class="score-container">
                            <strong class="score">${score.toFixed(2)}%</strong>
                            <div class="score-track">
                                <div class="score-fill"
                                    style="width:${Math.min(100, Math.max(0, score))}%">
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>${skillScore.toFixed(2)}%</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>

            <div class="section-heading candidate-heading">
                <h2>Candidate Profiles</h2>
                <p>Detailed skill analysis for every candidate.</p>
            </div>
        `;

        candidates.forEach((candidate, index) => {

            const matchedSkills = candidate.matched_skills || [];
            const missingSkills = candidate.missing_skills || [];

            html += `
                <div class="candidate-details">

                    <div class="profile-header">
                        <div>
                            <span class="rank-label">RANK #${index + 1}</span>
                            <h3>${escapeHTML(candidate.name || "Not Found")}</h3>
                            <p class="profile-email">
                                ${escapeHTML(candidate.email || "Not Found")}
                            </p>
                        </div>

                        <div class="profile-score">
                            ${Number(candidate.match_score || 0).toFixed(2)}%
                            <small>Overall Match</small>
                        </div>
                    </div>

                    <div class="profile-metrics">
                        <div>
                            <span>Text Similarity</span>
                            <strong>${Number(candidate.similarity_score || 0).toFixed(2)}%</strong>
                        </div>

                        <div>
                            <span>Skill Coverage</span>
                            <strong>${Number(candidate.skill_score || 0).toFixed(2)}%</strong>
                        </div>
                    </div>

                    <div class="skill-group">
                        <h4>✓ Matched Skills</h4>
                        <div class="skill-tags">
                            ${
                                matchedSkills.length
                                ? matchedSkills.map(skill =>
                                    `<span class="skill-tag matched">${escapeHTML(skill)}</span>`
                                  ).join("")
                                : "<span class='no-skills'>No matched skills</span>"
                            }
                        </div>
                    </div>

                    <div class="skill-group">
                        <h4>＋ Missing Skills</h4>
                        <div class="skill-tags">
                            ${
                                missingSkills.length
                                ? missingSkills.map(skill =>
                                    `<span class="skill-tag missing">${escapeHTML(skill)}</span>`
                                  ).join("")
                                : "<span class='no-skills'>No missing skills</span>"
                            }
                        </div>
                    </div>

                </div>
            `;
        });

        results.innerHTML = html;
    }

    // EXPORT CSV REPORT
    exportBtn.addEventListener("click", function () {

        if (candidateData.length === 0) {
            alert("No candidate data available to export.");
            return;
        }

        const headers = [
            "Rank",
            "Candidate Name",
            "Resume File",
            "Email",
            "Phone",
            "Skills",
            "Overall Match (%)",
            "Text Similarity (%)",
            "Skill Coverage (%)",
            "Matched Skills",
            "Missing Skills"
        ];

        const rows = candidateData.map((candidate, index) => [
            index + 1,
            candidate.name || "Not Found",
            candidate.filename || "",
            candidate.email || "Not Found",
            candidate.phone || "Not Found",
            (candidate.skills || []).join("; "),
            candidate.match_score ?? 0,
            candidate.similarity_score ?? 0,
            candidate.skill_score ?? 0,
            (candidate.matched_skills || []).join("; "),
            (candidate.missing_skills || []).join("; ")
        ]);

        function escapeCSV(value) {
            let text = String(value ?? "");

            // Prevent spreadsheet formula injection.
            if (/^[\s]*[=+\-@]/.test(text)) {
                text = "'" + text;
            }

            return '"' + text.replace(/"/g, '""') + '"';
        }

        const csvContent = [
            headers,
            ...rows
        ].map(row =>
            row.map(escapeCSV).join(",")
        ).join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "TalentIQ_Candidate_Report.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    });

    // HTML ESCAPING
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

});
