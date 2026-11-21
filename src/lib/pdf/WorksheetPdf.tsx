import path from "node:path";
import { Document, Font, Image, Line, Page, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { kindLabel, labelsFor, sheetLanguage, type SheetLabels } from "@/components/worksheet/labels";
import { describeTopic, type TopicDescription } from "@/data/curriculum";
import { brand } from "@/lib/brand";
import {
  matchingOrder,
  sectionMarks,
  splitBlanks,
  totalMarks,
  type NoteBlock,
  type Question,
  type Stimulus,
  type Worksheet,
  type WorksheetMeta,
} from "@/lib/worksheet";

// A worksheet as a real PDF document (not a picture of the web page):
// Letter size, the brand header and page numbers on every page, questions
// kept whole across page breaks, then the answer key starting on a new page.
//
// Fonts are embedded so French accents print the same everywhere. Noto Sans
// Math fills in symbols the brand fonts don't have (≈, →, √, π, ≤, ≥).

const fontDir = path.join(process.cwd(), "src/assets/fonts");
Font.register({
  family: "Fraunces",
  fonts: [
    { src: path.join(fontDir, "fraunces-latin-700-normal.woff"), fontWeight: 700 },
    { src: path.join(fontDir, "fraunces-latin-900-normal.woff"), fontWeight: 900 },
  ],
});
Font.register({
  family: "Sniglet",
  fonts: [
    { src: path.join(fontDir, "sniglet-latin-400-normal.woff"), fontWeight: 400 },
    { src: path.join(fontDir, "sniglet-latin-800-normal.woff"), fontWeight: 800 },
  ],
});
Font.register({ family: "NotoSansMath", src: path.join(fontDir, "noto-sans-math-latin-400-normal.woff") });
// Long words wrap at the margin instead of being hyphenated mid-word.
Font.registerHyphenationCallback((word) => [word]);

const logoPath = path.join(process.cwd(), "public", brand.logoHorizontalSrc);

const ink = "#004aad";
const violet = "#8c52ff";
const lilac = "#e2a9f1";
const line = "#e9e1fb";
const text = "#241a4f";
const muted = "#625a8a";
const paper = "#fbf8ff";

const body = ["Sniglet", "NotoSansMath"];
const display = ["Fraunces", "NotoSansMath"];

const s = StyleSheet.create({
  page: {
    paddingTop: 76,
    paddingBottom: 54,
    paddingHorizontal: 50,
    fontFamily: body,
    fontSize: 10.5,
    lineHeight: 1.4,
    color: text,
  },
  header: {
    position: "absolute",
    top: 28,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1.5,
    borderBottomColor: ink,
    paddingBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: line,
    paddingTop: 5,
    fontSize: 8,
    color: muted,
  },
  small: { fontSize: 8, color: muted },
  kind: { fontSize: 9, color: "#9a3fb5" },
  title: { fontFamily: display, fontWeight: 900, fontSize: 20, color: ink, lineHeight: 1.15 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 14,
  },
  sectionTitle: { fontFamily: display, fontWeight: 700, fontSize: 12.5, color: ink },
  sectionRule: { borderBottomWidth: 1.2, borderBottomColor: ink, marginTop: 2, marginBottom: 8 },
  question: { flexDirection: "row", marginBottom: 9 },
  number: { width: 20, fontFamily: display, fontWeight: 700, color: violet },
  marks: { width: 26, textAlign: "right", color: muted, fontSize: 9 },
  box: { borderWidth: 1.2, borderColor: line, borderRadius: 6, padding: 8, marginBottom: 8 },
  answer: { backgroundColor: paper, borderWidth: 1, borderColor: line, borderRadius: 5, padding: 6, marginTop: 4, fontSize: 9.5 },
  strong: { fontFamily: display, fontWeight: 700, color: ink },
  writeLine: { borderBottomWidth: 0.8, borderBottomColor: "#a49cc4", height: 22 },
});

export function WorksheetPdf({ worksheet, meta }: { worksheet: Worksheet; meta: WorksheetMeta }) {
  const description = describeTopic(meta.grade, meta.subject, meta.topicId);
  const lang = sheetLanguage(meta.subject);
  const labels = labelsFor(lang);
  const kindName = kindLabel(meta.kind, lang);

  return (
    <Document title={worksheet.title} author={brand.name} subject={`${description.gradeLabel} ${description.subjectName}: ${description.topicName}`} language={lang}>
      <Page size="LETTER" style={s.page}>
        <PageChrome description={description} label={kindName} labels={labels} />
        <Heading worksheet={worksheet} description={description} labels={labels} kindName={kindName} />
        <Body worksheet={worksheet} labels={labels} showAnswers={false} />
      </Page>
      <Page size="LETTER" style={s.page}>
        <PageChrome description={description} label={labels.answerKey} labels={labels} />
        <Text style={s.kind}>{labels.answerKey}</Text>
        <Text style={s.title}>{worksheet.title}</Text>
        <Body worksheet={worksheet} labels={labels} showAnswers />
      </Page>
    </Document>
  );
}

// The header and footer repeated on every page.
function PageChrome({ description, label, labels }: { description: TopicDescription; label: string; labels: SheetLabels }) {
  return (
    <>
      <View style={s.header} fixed>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text */}
        <Image src={logoPath} style={{ height: 30, width: 114.6 }} />
        <View style={{ alignItems: "flex-end", maxWidth: 300 }}>
          <Text style={s.small}>
            {description.gradeLabel} {description.subjectName}
          </Text>
          <Text style={{ fontSize: 8.5, color: ink }}>{description.topicName}</Text>
        </View>
      </View>
      <View style={s.footer} fixed>
        <Text>{brand.footer}</Text>
        <Text>{label}</Text>
        <Text render={({ pageNumber, totalPages }) => labels.pageOf(pageNumber, totalPages)} />
      </View>
    </>
  );
}

function Heading({
  worksheet,
  description,
  labels,
  kindName,
}: {
  worksheet: Worksheet;
  description: TopicDescription;
  labels: SheetLabels;
  kindName: string;
}) {
  return (
    <View style={{ marginBottom: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 12, fontSize: 9.5, color: muted }}>
        <Text>{labels.name} </Text>
        <View style={{ flex: 1, borderBottomWidth: 0.8, borderBottomColor: lilac, marginRight: 14, height: 12 }} />
        <Text>{labels.date} </Text>
        <View style={{ width: 110, borderBottomWidth: 0.8, borderBottomColor: lilac, height: 12 }} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, paddingRight: 14 }}>
          <Text style={s.kind}>{kindName}</Text>
          <Text style={s.title}>{worksheet.title}</Text>
          <Text style={{ marginTop: 4 }}>{worksheet.instructions}</Text>
        </View>
        <View style={{ width: 140, borderWidth: 1.2, borderColor: line, borderRadius: 6, fontSize: 8.5 }}>
          <View style={{ padding: 6, borderBottomWidth: 1.2, borderBottomColor: line }}>
            <Text style={{ color: muted }}>{labels.curriculum}</Text>
            <Text style={{ color: ink }}>
              {description.gradeLabel}, {description.strand ?? description.subjectName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 6 }}>
            <Text style={{ color: muted }}>{labels.total}</Text>
            <Text style={[s.strong, { fontSize: 10 }]}>/{totalMarks(worksheet)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Body({ worksheet, labels, showAnswers }: { worksheet: Worksheet; labels: SheetLabels; showAnswers: boolean }) {
  // Questions are numbered across sections: where each section starts.
  const starts = worksheet.sections.map((_, i) =>
    worksheet.sections.slice(0, i).reduce((n, sec) => n + sec.questions.length, 1),
  );
  return (
    <View>
      {worksheet.notes?.map((note, i) => (
        <Note key={i} note={note} labels={labels} />
      ))}
      {worksheet.sections.map((section, i) => {
        const header = (
          <View>
            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>{section.title}</Text>
              <Text style={{ fontSize: 9, color: muted }}>
                {sectionMarks(section)} {labels.marks}
              </Text>
            </View>
            <Text style={{ marginTop: 1 }}>{section.instructions}</Text>
            <View style={s.sectionRule} />
          </View>
        );
        const questions = section.questions.map((question, q) => (
          <QuestionRow
            key={q}
            number={starts[i] + q}
            question={question}
            labels={labels}
            showAnswers={showAnswers}
          />
        ));
        const passage = section.stimulus?.kind === "passage";
        return (
          <View key={i}>
            {passage ? (
              // A passage may run onto the next page, so only ask for room
              // for its first lines below the section title.
              <>
                <View wrap={false} minPresenceAhead={120}>
                  {header}
                </View>
                {showAnswers ? (
                  <Text style={[s.small, { marginBottom: 6 }]}>
                    {(section.stimulus as { title: string }).title} ({labels.seeWorksheet})
                  </Text>
                ) : (
                  <StimulusBlock stimulus={section.stimulus!} />
                )}
                {questions}
              </>
            ) : (
              // The section title, its table or rule box, and the first question
              // move to the next page together, so a title is never left alone.
              <>
                <View wrap={false}>
                  {header}
                  {section.stimulus && <StimulusBlock stimulus={section.stimulus} />}
                  {questions[0]}
                </View>
                {questions.slice(1)}
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

// One numbered question with its marks. A question is never split across pages.
function QuestionRow({
  number,
  question,
  labels,
  showAnswers,
}: {
  number: number;
  question: Question;
  labels: SheetLabels;
  showAnswers: boolean;
}) {
  return (
    <View style={s.question} wrap={false}>
      <Text style={s.number}>{number}.</Text>
      <View style={{ flex: 1 }}>
        <QuestionBlock question={question} labels={labels} showAnswers={showAnswers} />
      </View>
      <Text style={s.marks}>/{question.marks}</Text>
    </View>
  );
}

function Note({ note, labels }: { note: NoteBlock; labels: SheetLabels }) {
  return (
    <View style={[s.box, { borderColor: lilac, backgroundColor: paper }]} wrap={false}>
      <Text style={[s.strong, { fontSize: 11.5, marginBottom: 3 }]}>{note.heading}</Text>
      {note.points.map((p, i) => (
        <Bullet key={i}>{p}</Bullet>
      ))}
      {note.keyTerms?.map((k, i) => (
        <Text key={i} style={{ marginTop: 2 }}>
          <Text style={s.strong}>{k.term}: </Text>
          {k.definition}
        </Text>
      ))}
      {note.example && (
        <View style={{ marginTop: 5, backgroundColor: "white", borderRadius: 4, padding: 6 }}>
          <Text style={s.strong}>{labels.example}</Text>
          <Text>{note.example}</Text>
        </View>
      )}
    </View>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={{ width: 10, color: violet }}>•</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  );
}

function StimulusBlock({ stimulus }: { stimulus: Stimulus }) {
  switch (stimulus.kind) {
    case "passage":
      // A long passage can continue onto the next page, paragraph by paragraph.
      return (
        <View style={s.box}>
          <Text style={[s.strong, { fontSize: 12, textAlign: "center", marginBottom: 5 }]}>{stimulus.title}</Text>
          {stimulus.paragraphs.map((p, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 4 }}>
              <Text style={{ width: 14, fontSize: 7.5, color: muted, paddingTop: 2 }}>{i + 1}</Text>
              <Text style={{ flex: 1, lineHeight: 1.5 }}>{p}</Text>
            </View>
          ))}
        </View>
      );
    case "table":
      return (
        <View style={{ marginBottom: 9 }} wrap={false}>
          <Text style={[s.strong, { fontSize: 9.5, marginBottom: 3 }]}>{stimulus.title}</Text>
          <View style={{ borderWidth: 1, borderColor: line }}>
            {[stimulus.columns, ...stimulus.rows].map((row, r) => (
              <View
                key={r}
                style={{ flexDirection: "row", backgroundColor: r === 0 ? "#f6e9fb" : "white", borderTopWidth: r === 0 ? 0 : 1, borderTopColor: line }}
              >
                {row.map((cell, c) => (
                  <Text
                    key={c}
                    style={[
                      { flex: 1, padding: 4, fontSize: 9, borderLeftWidth: c === 0 ? 0 : 1, borderLeftColor: line },
                      r === 0 ? s.strong : {},
                    ]}
                  >
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      );
    case "rule":
      return (
        <View style={[s.box, { borderColor: ink }]} wrap={false}>
          <Text style={[s.strong, { marginBottom: 2 }]}>{stimulus.title}</Text>
          {stimulus.points.map((p, i) => (
            <Bullet key={i}>{p}</Bullet>
          ))}
        </View>
      );
    case "word-bank":
      return (
        <View style={[s.box, { borderStyle: "dashed", borderColor: lilac, flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }]} wrap={false}>
          {stimulus.words.map((w, i) => (
            <Text key={i} style={{ marginHorizontal: 7, marginVertical: 1 }}>
              {w}
            </Text>
          ))}
        </View>
      );
  }
}

const letters = ["A", "B", "C", "D"];
const blank = "_______________";

// Text with ___ shown as a line to write on, or with the answer filled in.
function WithBlanks({ value, answers }: { value: string; answers?: string[] }) {
  const parts = splitBlanks(value);
  return (
    <Text>
      {parts.map((part, i) => (
        <Text key={i}>
          {part}
          {i < parts.length - 1 &&
            (answers ? (
              <Text style={{ color: violet, textDecoration: "underline", fontFamily: display, fontWeight: 700 }}>
                {` ${answers[i] ?? ""} `}
              </Text>
            ) : (
              <Text style={{ color: muted }}>{blank}</Text>
            ))}
        </Text>
      ))}
    </Text>
  );
}

function QuestionBlock({ question, labels, showAnswers }: { question: Question; labels: SheetLabels; showAnswers: boolean }) {
  switch (question.type) {
    case "multiple-choice":
      return (
        <View>
          <WithBlanks value={question.prompt} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 3 }}>
            {question.choices.map((choice, j) => {
              const correct = showAnswers && j === question.answerIndex;
              return (
                <View key={j} style={{ width: "50%", flexDirection: "row", alignItems: "flex-start", paddingRight: 8, marginTop: 2 }}>
                  <View
                    style={{ width: 9, height: 9, borderRadius: 4.5, borderWidth: 1.2, borderColor: correct ? violet : lilac, backgroundColor: correct ? violet : "white", marginTop: 3, marginRight: 5 }}
                  />
                  <Text style={{ flex: 1, color: correct ? ink : text }}>
                    <Text style={{ color: muted }}>{letters[j]}. </Text>
                    {choice}
                  </Text>
                </View>
              );
            })}
          </View>
          {showAnswers && <Text style={s.answer}>{question.explanation}</Text>}
        </View>
      );

    case "true-false":
      return (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <WithBlanks value={question.statement} />
            </View>
            {[true, false].map((value) => {
              const circled = showAnswers && value === question.answer;
              return (
                <Text
                  key={String(value)}
                  style={{ borderWidth: 1, borderColor: circled ? violet : line, borderRadius: 8, paddingHorizontal: 6, marginLeft: 4, fontSize: 9, color: circled ? "white" : text, backgroundColor: circled ? violet : "white" }}
                >
                  {value ? labels.true : labels.false}
                </Text>
              );
            })}
          </View>
          {showAnswers && <Text style={s.answer}>{question.explanation}</Text>}
        </View>
      );

    case "fill-in-the-blank":
      return <WithBlanks value={question.prompt} answers={showAnswers ? question.answers : undefined} />;

    case "matching": {
      const { right, letterFor } = matchingOrder(question.pairs);
      return (
        <View>
          <Text>{question.prompt}</Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              {question.pairs.map((pair, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Text style={{ width: 24, borderBottomWidth: 0.8, borderBottomColor: "#a49cc4", textAlign: "center", marginRight: 6, color: violet, fontFamily: display, fontWeight: 700 }}>
                    {showAnswers ? letterFor(pair.match) : " "}
                  </Text>
                  <Text style={{ flex: 1 }}>{pair.term}</Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1.2 }}>
              {right.map((match, i) => (
                <Text key={i} style={{ marginBottom: 4 }}>
                  <Text style={s.strong}>{String.fromCharCode(65 + i)}. </Text>
                  {match}
                </Text>
              ))}
            </View>
          </View>
        </View>
      );
    }

    case "short-answer":
    case "long-answer":
      return (
        <View>
          <Text>{question.prompt}</Text>
          {showAnswers ? (
            <Text style={s.answer}>{question.answer}</Text>
          ) : (
            Array.from({ length: question.lines }, (_, i) => <View key={i} style={s.writeLine} />)
          )}
        </View>
      );

    case "show-your-work":
      return (
        <View>
          <Text>{question.prompt}</Text>
          {showAnswers ? (
            <View style={s.answer}>
              {question.solution.map((step, i) => (
                <Text key={i}>
                  {i + 1}. {step}
                </Text>
              ))}
              <Text style={[s.strong, { marginTop: 2 }]}>
                {labels.answer}: {question.answer}
              </Text>
            </View>
          ) : (
            <>
              <GraphPaper />
              <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 4 }}>
                <Text style={{ fontSize: 9.5 }}>{labels.answer}: </Text>
                <View style={{ width: 160, borderBottomWidth: 0.8, borderBottomColor: "#a49cc4", height: 12 }} />
              </View>
            </>
          )}
        </View>
      );
  }
}

// Working space for math, as light graph paper.
function GraphPaper() {
  const width = 470;
  const height = 96;
  const step = 12;
  return (
    <Svg width={width} height={height} style={{ marginTop: 4 }}>
      {Array.from({ length: Math.floor(width / step) + 1 }, (_, i) => (
        <Line key={`v${i}`} x1={i * step} y1={0} x2={i * step} y2={height} stroke="#ded8ef" strokeWidth={0.5} />
      ))}
      {Array.from({ length: Math.floor(height / step) + 1 }, (_, i) => (
        <Line key={`h${i}`} x1={0} y1={i * step} x2={width} y2={i * step} stroke="#ded8ef" strokeWidth={0.5} />
      ))}
    </Svg>
  );
}

// "grade-5-core-french-les-verbes-etre-et-avoir-quiz.pdf"
export function pdfFileName(worksheet: Worksheet, meta: WorksheetMeta): string {
  const description = describeTopic(meta.grade, meta.subject, meta.topicId);
  const slug = [description.gradeLabel, description.subjectName, description.topicName, kindLabel(meta.kind, "en")]
    .join(" ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "worksheet"}.pdf`;
}
