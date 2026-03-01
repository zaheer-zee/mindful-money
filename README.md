# The Context-Aware Behavioral Engine

**Demo Video:** [Google Drive Link](https://drive.google.com/drive/folders/1-IMRtwQMkTHn0QWP5CkKSQUxUo3g46-Z?usp=sharing)

A smart, proactive financial guardian that shifts personal finance from reactive auditing to proactive behavioral awareness by detecting spending anomalies using contextual AI and generating plain-English explanations.

## 1. Problem Statement

**Problem Title:** The "Blind Spot" in Personal Finance Management

**Problem Description:** 
Modern consumers generate massive, fragmented streams of financial data across bank accounts, UPI platforms, and credit cards. While banks provide basic historical transaction summaries, users lack tools that proactively highlight irregularities or subtle financial leaks—such as unexpected recurring charges, gradual lifestyle creep, or unfamiliar merchants. 

**Target Users:** 
Individuals generating extensive transaction histories (like UPI and credit card users) who want to monitor their financial health and quickly identify "death by a thousand cuts" spending habits.

**Existing Gaps:** 
Traditional anomaly detectors generate high false positives by relying strictly on mathematical standard deviations, failing to understand the *narrative* of a user's life (e.g., flagging a high spend during a vacation as an anomaly).

## 2. Problem Understanding & Approach

**Root Cause Analysis:** 
Financial stress and passive money management stem from the inability to quickly digest and contextualize raw unstructured data. Users either have to manually audit spreadsheets or rely on rudimentary bank alerts which lack behavioral understanding.

**Solution Strategy:** 
We replace arbitrary numerical risk scores with a "Shadow Twin" behavioral baseline. By integrating Large Language Models (LLMs) to understand transaction context and Machine Learning clustering to flag mathematical deviations, the system acts as an explainable financial coach.

## 3. Proposed Solution

**Solution Overview:** 
A secure web platform where users can upload messy CSV/PDF bank statements. The system standardizes the data, applies intelligent categorization, establishes a spending baseline, and flags behavioral breaks on a visual "Seismograph" timeline.

**Core Idea:** 
To evaluate transactions against a behavioral baseline ("Shadow Twin") rather than static rules, and explain any deviations (magnitude, frequency, geographic sequence, silent leaks) in plain, actionable English.

**Key Features:**
- **Robust Ingestion Pipeline:** Reliable parsing of structured (CSV) and unstructured (PDF) bank statements.
- **Context-Aware Categorization:** LLM-powered cleaning of raw merchant names and semantic category assignment (e.g., differentiating an airport Uber from a hometown Uber Eats).
- **The Shadow Twin Baseline:** Machine learning models to establish a profile of regular spending habits.
- **Explainable Anomaly Detection:** No arbitrary scores—just plain-language AI explanations of why a transaction triggered an alert.
- **Seismograph Dashboard:** A dynamic, interactive visual timeline representing the user's spending heartbeat, rendering anomalies as clickable spikes.

## 4. System Architecture

**High-Level Flow:**
`User` → `Next.js Frontend` → `FastAPI Backend` → `Llama (via Groq) & Scikit-Learn Model` → `PostgreSQL Database` → `Recharts Seismograph Response`

**Architecture Description:** 
The Next.js frontend handles secure user interactions and visualizes the data timeline. Uploaded files are sent to the Python FastAPI backend, which relies on Pandas and pdfplumber to extract raw tabular data. Extracted transactions are sent through Llama via Groq's high-speed API for cleaning and categorization, then checked against the user's Scikit-Learn behavioral baseline. Flagged anomalies and categorized data are stored in a PostgreSQL database and returned to the frontend for display.

**Architecture Diagram:**
*(Add system architecture diagram image here)*

## 5. Database Design

**ER Diagram:**
*(Add ER diagram image here)*

**ER Diagram Description:**
The relational PostgreSQL schema includes core entities:
- **Users**: Authentication and profile data.
- **Bank Statements**: Records of uploaded files and ingestion status.
- **Transactions**: Stores both raw extracted data and AI-cleaned data (merchant name, normalized date, amount, transaction type).
- **Categories**: Taxonomies for AI classifications.
- **Anomalies**: Linked to transactions, storing the `anomaly_type` (Magnitude, Frequency, Sequence, SilentLeak), a boolean `is_acknowledged` flag, and the `ai_explanation_text`.

## 6. Dataset Selected

**Dataset Name:** Simulated Banking Transaction History  
**Source:** Synthetically generated Mock Data (MVP Phase)  
**Data Type:** Tabular (CSV) and Synthesized PDFs  
**Selection Reason:** Due to strict privacy constraints regarding real financial data, we use simulated data engineered to exhibit complex spending patterns, typical bank statement noise, and varied behavioral anomalies (e.g., recurring subscription injections, sudden frequency bursts).  
**Preprocessing Steps:** 
- Table region boundary detection inside PDFs (using `pdfplumber`).
- Date normalization and numerical formatting.
- Dropping redundant columns/headers using `Pandas`.

## 7. Model Selected

**Model Name:** 
- *Contextual Categorization & Explainability:* Llama (via high-speed Groq API).
- *Behavioral Baseline/Clustering:* Scikit-Learn Isolation Forests & DBSCAN.

**Selection Reasoning:** 
- LLMs excel at cleaning messy gibberish strings (e.g., `TST* Doordash SF`) and understanding semantic context.
- Isolation Forests mathematically detect multi-dimensional outliers efficiently without requiring exhaustive labeling.

**Alternatives Considered:** 
- Traditional Regex (rejected for extreme rigidity).
- Standard Deviation/Z-Score models (rejected for generating too many false positive alerts).

**Evaluation Metrics:** 
- Low False Positive Rate (FPR) on standard lifestyle profile deviations.
- Classification accuracy of merchant clean names and categories.

## 8. Technology Stack

- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion, Recharts/D3.js, Zustand
- **Backend:** Python, FastAPI, Pandas, pdfplumber/PyMuPDF
- **ML/AI:** Llama (via Groq API), Scikit-Learn
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Deployment:** Vercel (Frontend) & Railway/Render (Backend API)

## 15. Future Scope & Scalability

**Short-Term:**
- Direct bank account integration via Plaid or similar open-banking APIs to eliminate manual PDF/CSV uploads.
- Real-time automated WhatsApp or push notification alerts for instant anomaly detection.

**Long-Term:**
- Family or paired accounts to track shared financial discipline.
- Automated categorization training loop where the AI learns from manual user corrections.
- Subscription lifecycle tracking and predictive cancellation recommendations.

## 16. Known Limitations

- High reliance on LLM inference speed and API costs, requiring robust caching mechanisms to scale.
- Accurately parsing edge-case, highly obfuscated, or non-standard regional bank PDF statement formats.
- Complete dependency on historical data volume to establish an accurate baseline (cold-start problem for new users).

## 17. Impact

By bridging the gap between raw data and behavioral insight, The Context-Aware Behavioral Engine empowers users to actively correct financial leakage without needing accounting skills. It transforms budgeting from a guilt-driven retrospective task into a proactive, gamified, and highly personalized financial health monitor.
