import path from "node:path";
import {
  Circle,
  Document,
  Font,
  Image,
  Line,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  Text as SvgText,
  View,
} from "@react-pdf/renderer";
import type { ComponentType, ReactNode } from "react";
import { kindLabel, labelsFor, sheetLanguage, type SheetLabels } from "@/components/worksheet/labels";
import { describeTopic, type TopicDescription } from "@/data/curriculum";
import { brand } from "@/lib/brand";
import { gradeBand, type GradeBand } from "@/lib/grade-bands";
import { picturePath, type PictureName } from "@/lib/pictures";
import { drawVisual, type Prim } from "@/components/worksheet/visual-geometry";
import {
  matchingOrder,
  sectionMarks,
  splitBlanks,
  totalMarks,
  type NoteBlock,
  type Question,
  type Stimulus,
  type Visual,
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
const pictureFile = (name: PictureName) => path.join(process.cwd(), "public", picturePath(name));

// How the PDF looks for each age group, matching the web version: bigger type,
// handwriting lines and answer boxes for Grades 1 and 2, a denser page for 7 and 8.
type PdfLook = { fontSize: number; line: number; handwriting: boolean; boxes: boolean; big: boolean; gap: number; work: number };
const pdfLooks: Record<GradeBand, PdfLook> = {
  early: { fontSize: 13.5, line: 34, handwriting: true, boxes: true, big: true, gap: 16, work: 80 },
  primary: { fontSize: 12, line: 28, handwriting: true, boxes: false, big: false, gap: 12, work: 90 },
  junior: { fontSize: 10.5, line: 22, handwriting: false, boxes: false, big: false, gap: 9, work: 96 },
  intermediate: { fontSize: 10, line: 20, handwriting: false, boxes: false, big: false, gap: 8, work: 108 },
};

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
  const look = pdfLooks[gradeBand(meta.grade)];
  const page = [s.page, { fontSize: look.fontSize }];

  return (
    <Document title={worksheet.title} author={brand.name} subject={`${description.gradeLabel} ${description.subjectName}: ${description.topicName}`} language={lang}>
      <Page size="LETTER" style={page}>
        <PageChrome description={description} label={kindName} labels={labels} />
        <Heading worksheet={worksheet} description={description} labels={labels} kindName={kindName} />
        <Body worksheet={worksheet} labels={labels} showAnswers={false} look={look} />
      </Page>
      <Page size="LETTER" style={page}>
        <PageChrome description={description} label={labels.answerKey} labels={labels} />
        <Text style={s.kind}>{labels.answerKey}</Text>
        <Text style={s.title}>{worksheet.title}</Text>
        <Body worksheet={worksheet} labels={labels} showAnswers look={look} />
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

function Body({
  worksheet,
  labels,
  showAnswers,
  look,
}: {
  worksheet: Worksheet;
  labels: SheetLabels;
  showAnswers: boolean;
  look: PdfLook;
}) {
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
            look={look}
            card={section.layout === "cards"}
          />
        ));
        const passage = section.stimulus?.kind === "passage";
        return (
          <View key={i}>
            {section.layout === "cards" ? (
              // Short tasks in boxes, two to a row.
              <>
                <View wrap={false}>
                  {header}
                  {section.stimulus && <StimulusBlock stimulus={section.stimulus} />}
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>{questions}</View>
              </>
            ) : passage ? (
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
  look,
  card,
}: {
  number: number;
  question: Question;
  labels: SheetLabels;
  showAnswers: boolean;
  look: PdfLook;
  card: boolean;
}) {
  const cardStyle = card ? { width: "48.5%", borderWidth: 1.2, borderColor: line, borderRadius: 8, padding: 8 } : {};
  return (
    <View style={[s.question, { marginBottom: look.gap }, cardStyle]} wrap={false}>
      {look.big ? (
        // Young students get their question numbers in a circle.
        <View style={{ width: 28 }}>
          <View style={{ width: 21, height: 21, borderRadius: 10.5, backgroundColor: "#f3dcf9", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: display, fontWeight: 700, color: ink, fontSize: 11, lineHeight: 1 }}>{number}</Text>
          </View>
        </View>
      ) : (
        <Text style={s.number}>{number}.</Text>
      )}
      <View style={{ flex: 1 }}>
        <QuestionBlock question={question} labels={labels} showAnswers={showAnswers} look={look} card={card} />
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
    case "visual":
      return <VisualPdf visual={stimulus.visual} />;
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

function QuestionBlock({
  question,
  labels,
  showAnswers,
  look,
  card,
}: {
  question: Question;
  labels: SheetLabels;
  showAnswers: boolean;
  look: PdfLook;
  card: boolean;
}) {
  // A drawing that goes with the question, shown under its prompt.
  const visual = question.visual && <VisualPdf visual={question.visual} big={look.big} maxWidth={card ? 215 : 470} />;
  switch (question.type) {
    case "multiple-choice":
      return (
        <View>
          <WithBlanks value={question.prompt} />
          {visual}
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
          {visual}
          {showAnswers && <Text style={s.answer}>{question.explanation}</Text>}
        </View>
      );

    case "fill-in-the-blank":
      return (
        <View>
          {visual}
          {look.boxes ? (
            <BoxedBlanks value={question.prompt} answers={showAnswers ? question.answers : undefined} />
          ) : (
            <WithBlanks value={question.prompt} answers={showAnswers ? question.answers : undefined} />
          )}
        </View>
      );

    case "matching": {
      const { right, letterFor } = matchingOrder(question.pairs);
      return (
        <View>
          <Text>{question.prompt}</Text>
          {visual}
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              {question.pairs.map((pair, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Text style={{ width: 24, borderBottomWidth: 0.8, borderBottomColor: "#a49cc4", textAlign: "center", marginRight: 6, color: violet, fontFamily: display, fontWeight: 700 }}>
                    {showAnswers ? letterFor(pair.match) : " "}
                  </Text>
                  {pair.picture && (
                    // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text
                    <Image src={pictureFile(pair.picture)} style={{ width: look.big ? 28 : 20, height: look.big ? 28 : 20, marginRight: 5 }} />
                  )}
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
          {visual}
          {showAnswers ? (
            <Text style={s.answer}>{question.answer}</Text>
          ) : (
            Array.from({ length: question.lines }, (_, i) => <WriteLine key={i} look={look} />)
          )}
        </View>
      );

    case "show-your-work":
      return (
        <View>
          <Text>{question.prompt}</Text>
          {visual}
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
              <GraphPaper width={card ? 210 : 470} height={look.work} />
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
function GraphPaper({ width, height }: { width: number; height: number }) {
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

// A line to write on. Young students get handwriting lines: a light top line,
// a dashed middle line and a darker base line.
function WriteLine({ look }: { look: PdfLook }) {
  if (!look.handwriting) return <View style={[s.writeLine, { height: look.line }]} />;
  const w = 470;
  return (
    <Svg width={w} height={look.line} style={{ marginTop: 2 }}>
      <Line x1={0} y1={2} x2={w} y2={2} stroke="#c9c2e0" strokeWidth={0.7} />
      <Line x1={0} y1={look.line / 2 + 1} x2={w} y2={look.line / 2 + 1} stroke="#b9b0d6" strokeWidth={0.7} strokeDasharray="4 3" />
      <Line x1={0} y1={look.line - 1} x2={w} y2={look.line - 1} stroke="#6f6798" strokeWidth={1.2} />
    </Svg>
  );
}

// Fill-in-the-blank with boxes to write in, for Grades 1 and 2.
function BoxedBlanks({ value, answers }: { value: string; answers?: string[] }) {
  const parts = splitBlanks(value);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
      {parts.map((part, i) => (
        <View key={i} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
          {part
            .split(/\s+/)
            .filter(Boolean)
            .map((word, j) => (
              <Text key={j} style={{ marginRight: 4 }}>
                {word}
              </Text>
            ))}
          {i < parts.length - 1 && (
            <View style={{ minWidth: 44, height: 30, borderWidth: 1.5, borderColor: "#6f6798", borderRadius: 5, marginRight: 4, marginVertical: 2, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 }}>
              {answers && <Text style={{ color: violet, fontFamily: display, fontWeight: 700 }}>{answers[i]}</Text>}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

// A worksheet drawing in the PDF, from the same shapes as the web version.
function VisualPdf({ visual, big = false, maxWidth = 470 }: { visual: Visual; big?: boolean; maxWidth?: number }) {
  if (visual.kind === "pictures") {
    const size = big ? 24 : 18;
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginVertical: 5 }} wrap={false}>
        {visual.groups.map((group, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
            {i > 0 && visual.operator && (
              <Text style={{ fontFamily: display, fontWeight: 700, fontSize: 20, color: ink, marginHorizontal: 6 }}>
                {visual.operator === "-" ? "−" : "+"}
              </Text>
            )}
            <View style={{ flexDirection: "row", flexWrap: "wrap", maxWidth: Math.min(200, maxWidth - 30), borderWidth: 1.2, borderStyle: "dashed", borderColor: lilac, borderRadius: 8, padding: 4 }}>
              {Array.from({ length: group.count }, (_, j) => (
                // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text
                <Image key={j} src={pictureFile(group.picture)} style={{ width: size, height: size, margin: 1.5 }} />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }
  if (visual.kind === "picture-cards") {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 5 }} wrap={false}>
        {visual.cards.map((card, i) => (
          <View key={i} style={{ width: 76, alignItems: "center", borderWidth: 1.2, borderColor: line, borderRadius: 8, padding: 5, marginRight: 6, marginBottom: 6 }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text */}
            <Image src={pictureFile(card.picture)} style={{ width: 36, height: 36 }} />
            {card.label ? (
              <Text style={{ fontSize: 9, textAlign: "center", marginTop: 3, color: ink }}>{card.label}</Text>
            ) : (
              <View style={{ width: 60, borderBottomWidth: 0.8, borderBottomColor: "#6f6798", height: 16 }} />
            )}
          </View>
        ))}
      </View>
    );
  }
  const drawing = drawVisual(visual);
  // Scale to fit the page width, and a little larger for young students.
  const scale = Math.min(big ? 0.95 : 0.8, maxWidth / drawing.width);
  return (
    <View style={{ marginVertical: 5 }} wrap={false}>
      <Svg width={drawing.width * scale} height={drawing.height * scale} viewBox={`0 0 ${drawing.width} ${drawing.height}`}>
        {drawing.prims.map((p, i) => (
          <PrimPdf key={i} p={p} />
        ))}
      </Svg>
    </View>
  );
}

// Inside an Svg, react-pdf's Image takes x and y, which its types leave out.
const SvgImage = Image as unknown as ComponentType<{ src: string; x: number; y: number; style: { width: number; height: number } }>;

function PrimPdf({ p }: { p: Prim }) {
  switch (p.t) {
    case "rect":
      return <Rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} fill={p.fill ?? "none"} stroke={p.stroke} strokeWidth={p.sw} />;
    case "circle":
      return <Circle cx={p.cx} cy={p.cy} r={p.r} fill={p.fill ?? "none"} stroke={p.stroke} strokeWidth={p.sw} />;
    case "line":
      return <Line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.stroke} strokeWidth={p.sw} strokeDasharray={p.dash} strokeLinecap="round" />;
    case "path":
      return <Path d={p.d} fill={p.fill ?? "none"} stroke={p.stroke} strokeWidth={p.sw} />;
    case "text":
      return (
        <SvgText x={p.x} y={p.y} fill={p.fill} textAnchor={p.anchor} style={{ fontSize: p.size, fontFamily: p.bold ? "Fraunces" : "Sniglet", fontWeight: p.bold ? 700 : 400 }}>
          {p.text}
        </SvgText>
      );
    case "image":
      return <SvgImage src={pictureFile(p.picture)} x={p.x} y={p.y} style={{ width: p.w, height: p.h }} />;
  }
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
