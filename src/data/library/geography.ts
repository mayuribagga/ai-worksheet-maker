import { course, strand, topic } from "./build";

// Geography, Grades 7–8, following The Ontario Curriculum: Social Studies,
// Grades 1 to 6; History and Geography, Grades 7 and 8 (2018, with the 2023
// Indigenous-content revisions). Strand names are the curriculum's own.

export const geography = [
  course(7, "geography", [
    strand("Physical Patterns in a Changing World",
      topic("Landforms and geological processes", "Plate tectonics; Mountains, plains and plateaus; Erosion and weathering"),
      topic("Climate and weather patterns", "Weather and climate; Factors that affect climate; Climate graphs"),
      topic("Vegetation and ecosystems", "Natural vegetation regions; Biomes of the world"),
      topic("Natural disasters", "Earthquakes, volcanoes, floods and storms; How people prepare and respond"),
      topic("Human–environment interactions", "How physical features affect people; How people change the environment"),
      topic("Maps, coordinates, scale and direction", "Latitude and longitude; Map scale; Compass directions; Thematic maps"),
    ),
    strand("Natural Resources Around the World: Use and Sustainability",
      topic("Types of natural resources", "Renewable and non-renewable resources; Flow resources"),
      topic("Using and extracting resources", "Mining, forestry, fishing and farming; Where resources are found"),
      topic("Environmental issues", "Effects of resource use; Climate change; Protecting the environment"),
      topic("Sustainability and stewardship", "Sustainable practices; Indigenous perspectives on stewardship; What individuals can do"),
      topic("Geographic inquiry", "Asking questions; Gathering and analyzing data; Communicating findings"),
    ),
  ], { title: "Physical Patterns in a Changing World / Natural Resources Around the World" }),

  course(8, "geography", [
    strand("Global Settlement: Patterns and Sustainability",
      topic("Global settlement patterns", "Linear, scattered and clustered settlement; Why people live where they do"),
      topic("Population growth and distribution", "Population density; Population distribution; Population growth"),
      topic("Migration and immigration", "Push and pull factors; Migration in Canada and the world"),
      topic("Urbanization and rural communities", "Growth of cities; Urban and rural land use; Challenges of urban growth"),
      topic("Sustainability and settlement", "Environmental impacts of settlement; Sustainable communities"),
      topic("Mapping and geographic technologies", "Thematic maps; GIS and satellite images; Population pyramids"),
    ),
    strand("Global Inequalities: Economic Development and Quality of Life",
      topic("Development and quality of life", "Indicators: life expectancy, literacy and birth rate; Comparing countries"),
      topic("Economic activities and trade", "Primary, secondary and tertiary industries; Trade between countries"),
      topic("Access to resources and services", "Clean water, food, health care and education; Why access is unequal"),
      topic("Global interdependence", "How countries depend on each other; Global connections"),
      topic("Solutions to global challenges", "International aid and organizations; Fair trade; Taking action"),
    ),
  ], { title: "Global Settlement: Patterns and Sustainability / Global Inequalities" }),
];
