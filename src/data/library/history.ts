import { course, strand, topic } from "./build";

// History, Grades 7–8, following The Ontario Curriculum: Social Studies,
// Grades 1 to 6; History and Geography, Grades 7 and 8 (2018, with the 2023
// Indigenous-content revisions). Strand names are the curriculum's own.

export const history = [
  course(7, "history", [
    strand("New France and British North America, 1713–1800",
      topic("Life in New France", "The seigneurial system; Daily life; The role of the Church"),
      topic("Indigenous peoples and European relationships", "Alliances and trade; Treaties; Effects of colonization"),
      topic("The fur trade", "Trading companies; Roles of First Nations and Métis peoples; Competition and conflict"),
      topic("The Seven Years' War", "Causes; The Conquest of 1759–1760; The Treaty of Paris (1763)"),
      topic("British rule in North America", "The Royal Proclamation of 1763; The Quebec Act (1774); Life under British rule"),
      topic("The American Revolution and the Loyalists", "Causes of the Revolution; Loyalists who came north; Black and Indigenous Loyalists"),
      topic("Historical thinking and primary sources", "Analyzing primary sources; Historical perspective; Cause and consequence"),
    ),
    strand("Canada, 1800–1850: Conflict and Challenges",
      topic("The War of 1812", "Causes; Key battles and people; First Nations allies; Effects of the war"),
      topic("Immigration and settlement", "Who came and why; Challenges for newcomers; Effects on Indigenous peoples"),
      topic("The Rebellions of 1837–1838", "Causes in Upper and Lower Canada; Key people; Outcomes"),
      topic("The Durham Report and the Act of Union", "Lord Durham's recommendations; The Province of Canada"),
      topic("Responsible government", "What it means; How it was achieved"),
      topic("Social, political and economic change", "Life for different groups; Transportation and industry; Rights and inequality"),
    ),
  ], { title: "New France and British North America / Canada, 1800–1850" }),

  course(8, "history", [
    strand("Creating Canada, 1850–1890",
      topic("Confederation", "Reasons for Confederation; The Fathers of Confederation; The British North America Act (1867)"),
      topic("Provinces and territories join Canada", "Manitoba, British Columbia and Prince Edward Island; The North-West Territories"),
      topic("Indigenous peoples and the Canadian state", "The Indian Act (1876); Effects on First Nations; Métis rights"),
      topic("The numbered treaties", "What the treaties promised; Different understandings of the treaties; Treaties today"),
      topic("Residential schools", "Why they were created; Experiences of students; Lasting effects and reconciliation"),
      topic("Expansion westward", "The Red River and North-West Resistances; The Canadian Pacific Railway; Effects on Indigenous peoples"),
    ),
    strand("Canada, 1890–1914: A Changing Society",
      topic("Immigration and settlement of the West", "Immigration policies; Experiences of newcomers; Discrimination and exclusion"),
      topic("Industrialization and urbanization", "Factories and new technology; Growth of cities; Working conditions"),
      topic("Women's rights and suffrage", "The suffrage movement; Women's work; Key people"),
      topic("Development of Canadian society", "Social reform; Rights and inequality; Daily life in 1900"),
      topic("Canadian identity and citizenship", "Canada's place in the British Empire; Changing ideas of who is Canadian"),
      topic("Historical thinking and primary sources", "Analyzing photographs and documents; Historical perspective; Continuity and change"),
    ),
  ], {
    title: "Creating Canada, 1850–1890 / Canada, 1890–1914: A Changing Society",
    note: "Grade 8 History ends in 1914. The First World War is studied in Grade 10 History.",
  }),
];
