import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const navigationItems = [
  {
    page: "mealPlans",
    icon: "📋",
  },
  {
    page: "home",
    icon: "🍔",
  },
  {
    page: "addMeal",
    icon: "➕",
  },
  {
    page: "settings",
    icon: "⚙️",
  },
];

const mealTypes = [
  {
    value: "Brokastis",
    label: "🍳 Brokastis",
  },
  {
    value: "Pusdienas",
    label: "🍝 Pusdienas",
  },
  {
    value: "Vakariņas",
    label: "🥩 Vakariņas",
  },
  {
    value: "Deserts",
    label: "🍰 Deserts",
  },
];

const addMealCards = [
  ...mealTypes,

  {
    value: "addSide",
    label: "🍚 Piedevas",
  },

  {
    value: "addSalad",
    label: "🥗 Salāti",
  },
];

const filterGroups = {
  Brokastis: [
    ["Silts", "Auksts"],
    ["Salds", "Sāļš"],
    ["Olas", "Maize", "Pankūkas", "Biezpiens"],
    ["15 min"],
  ],

  Pusdienas: [
    ["Silts", "Auksts"],
    ["Salds", "Sāļš"],
    ["Zupa", "Nezupa"],
    ["15 min"],
  ],

  Vakariņas: [
    ["Silts", "Auksts"],
    ["Vista", "Cūka", "Liellops", "Zivs"],
  ],

  Deserts: [
  ],
};

export default function App() {
  const galleryInputRef = useRef(null);
  const longPressRef = useRef(null);
  const [mealType, setMealType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [meals,setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedSide, setSelectedSide] = useState("");
  const [selectedSalad, setSelectedSalad] = useState("");
  const [currentPage, setCurrentPage] = useState("mealPlans");
  const [newMealName, setNewMealName] = useState("");
  const [editingMeal, setEditingMeal] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [savedMealPlans, setSavedMealPlans] = useState([]);
  const [session, setSession] = useState(null);
  const [hasDatabase, setHasDatabase] = useState(false);
  const [databaseId, setDatabaseId] = useState(null);
  const [databaseName, setDatabaseName] = useState("");
  const [showCreateDbPopup,  setShowCreateDbPopup] = useState(false);
  const [newDatabaseName,  setNewDatabaseName] = useState("");
  const [loadingDatabase, setLoadingDatabase] = useState(true);

function TopNavigation() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        {navigationItems.map((item) => (
          <button
            key={item.page}
            onClick={() =>
              setCurrentPage(item.page)
            }
            style={{
              width:
                currentPage === item.page
                  ? "60px"
                  : "50px",

              height:
                currentPage === item.page
                  ? "60px"
                  : "50px",

              fontSize:
                currentPage === item.page
                  ? "32px"
                  : "26px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,

              borderRadius: "12px",

              border:
                currentPage === item.page
                  ? "3px solid #000"
                  : "2px solid #000",

              backgroundColor: "#ffffff",

              cursor: "pointer",
            }}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </>
  );
}

const pageTitleStyle = {
  marginTop: "0",
  marginBottom: "16px",
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "bold",
};

async function signInGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
  });
}

async function signOut() {
  await supabase.auth.signOut();
}

  const DoubleLine = () => (
    
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      margin: "8px 0",
    }}
  >
    <hr
      style={{
        border: "none",
        borderTop: "3px solid #000",
        width: "100%",
        margin: 0,
      }}
    />

    <hr
      style={{
        border: "none",
        borderTop: "3px solid #000",
        width: "100%",
        margin: "4px 0 0 0",
      }}
    />
  </div>
);

const [selectedSideItem, setSelectedSideItem] =
  useState(null);

const [selectedSaladItem, setSelectedSaladItem] =
  useState(null);

const [showSidesPopup, setShowSidesPopup] =
  useState(false);

const [showSaladsPopup, setShowSaladsPopup] =
  useState(false);

const [showSaveWarning,
      setShowSaveWarning]
      = useState(false);
  
const [newMealType, setNewMealType] =
  useState("");

const [newMealImage, setNewMealImage] =
  useState(null);

const [allSides, setAllSides] = useState([]);
const [allSalads, setAllSalads] = useState([]);

const [hasSides, setHasSides] =
  useState(false);

const [hasSalads, setHasSalads] =
  useState(false);

const [newMealSelectedTags,
  setNewMealSelectedTags] = useState([]);

const [shoppingList, setShoppingList] = useState({
  vegetables: [],
  fruits: [],
  meatFish: [],
  dairy: [],
  grains: [],
});

const [mealPlan, setMealPlan] = useState({
        Brokastis: [],
        Pusdienas: [],
        Vakariņas: [],
        Deserts:[],
});

function toggleTag(tag) {
  if (selectedTags.includes(tag)) {
    setSelectedTags(
      selectedTags.filter((t) => t !== tag)
    );
    return;
  }

  let newTags = [...selectedTags];

  // Salds/Sāļš
  if (tag === "Salds") {
    newTags = newTags.filter(
      (t) => t !== "Sāļš"
    );
  }

  if (tag === "Sāļš") {
    newTags = newTags.filter(
      (t) => t !== "Salds"
    );
  }

  // Silts/Auksts
  if (tag === "Silts") {
    newTags = newTags.filter(
      (t) => t !== "Auksts"
    );
  }

  if (tag === "Auksts") {
    newTags = newTags.filter(
      (t) => t !== "Silts"
    );
  }

  // Olas / Maize / Pankūkas / Biezpiens

if (tag === "Olas") {
  newTags = newTags.filter(
    (t) =>
      t !== "Maize" &&
      t !== "Pankūkas" &&
      t !== "Biezpiens"
  );
}

if (tag === "Maize") {
  newTags = newTags.filter(
    (t) =>
      t !== "Olas" &&
      t !== "Pankūkas" &&
      t !== "Biezpiens"
  );
}

if (tag === "Pankūkas") {
  newTags = newTags.filter(
    (t) =>
      t !== "Olas" &&
      t !== "Maize" &&
      t !== "Biezpiens"
  );
}

if (tag === "Biezpiens") {
  newTags = newTags.filter(
    (t) =>
      t !== "Olas" &&
      t !== "Maize" &&
      t !== "Pankūkas"
  );
}

// Zupa / Nezupa

if (tag === "Zupa") {
  newTags = newTags.filter(
    (t) => t !== "Nezupa"
  );
}

if (tag === "Nezupa") {
  newTags = newTags.filter(
    (t) => t !== "Zupa"
  );
}

if (tag === "Vista") {
  newTags = newTags.filter(
    (t) =>
      t !== "Cūka" &&
      t !== "Liellops" &&
      t !== "Zivs"
  );
}

if (tag === "Cūka") {
  newTags = newTags.filter(
    (t) =>
      t !== "Vista" &&
      t !== "Liellops" &&
      t !== "Zivs"
  );
}

if (tag === "Liellops") {
  newTags = newTags.filter(
    (t) =>
      t !== "Vista" &&
      t !== "Cūka" &&
      t !== "Zivs"
  );
}

if (tag === "Zivs") {
  newTags = newTags.filter(
    (t) =>
      t !== "Vista" &&
      t !== "Cūka" &&
      t !== "Liellops"
  );
}

  setSelectedTags([...newTags, tag]);
}

function resetMealForm() {
  setEditingMeal(null);
  setNewMealName("");
  setNewMealType("");
  setNewMealSelectedTags([]);
  setNewMealImage(null);
  setHasSides(false);
  setHasSalads(false);
}

async function saveMealPlan() {

  const hasMeals =
    Object.values(mealPlan)
      .some((list) => list.length > 0);

  if (!hasMeals) {
    alert("Ēdienkarte ir tukša");
    return;
  }

  const { error } =
    await supabase
      .from("meal_plans")
      .insert([
        {
          plan: mealPlan,
          user_id: session.user.id
        },
      ]);

  if (error) {
    console.log(error);
    alert("Kļūda saglabājot");
    return;
  }

  await loadMealPlans();

  alert("Ēdienkarte saglabāta");
}

function toggleNewMealTag(tag) {
  if (newMealSelectedTags.includes(tag)) {
    setNewMealSelectedTags(
      newMealSelectedTags.filter(
        (t) => t !== tag
      )
    );
    return;
  }

  let newTags = [...newMealSelectedTags];

  // Salds / Sāļš

  if (tag === "Salds") {
    newTags = newTags.filter(
      (t) => t !== "Sāļš"
    );
  }

  if (tag === "Sāļš") {
    newTags = newTags.filter(
      (t) => t !== "Salds"
    );
  }

  // Silts / Auksts

  if (tag === "Silts") {
    newTags = newTags.filter(
      (t) => t !== "Auksts"
    );
  }

  if (tag === "Auksts") {
    newTags = newTags.filter(
      (t) => t !== "Silts"
    );
  }

  // Zupa / Nezupa

  if (tag === "Zupa") {
    newTags = newTags.filter(
      (t) => t !== "Nezupa"
    );
  }

  if (tag === "Nezupa") {
    newTags = newTags.filter(
      (t) => t !== "Zupa"
    );
  }

  setNewMealSelectedTags([
    ...newTags,
    tag,
  ]);
}

async function uploadImage(file) {
  if (!file) return "";

  const fileName =
    `${Date.now()}-${file.name}`;

  const { error } = await supabase
    .storage
    .from("meal-images")
    .upload(fileName, file);

  if (error) {
    console.log(error);
    return "";
  }

  const { data } = supabase
    .storage
    .from("meal-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

async function saveMeal() {
 
let imageUrl = "";

if (
  (
    newMealType !== "Deserts" &&
    newMealSelectedTags.length === 0
  ) ||
  !newMealImage
) {
  setShowSaveWarning(true);
  return;
}

if (newMealImage) {
  imageUrl = await uploadImage(
    newMealImage
  );
}

  if (!newMealName || !newMealType) {
    alert("Norādi nosaukumu un ēdienreizi");
    return;
  }

const { data, error } = await supabase
  .from("meals")
  .insert([
    {
      name: newMealName,
      meal_type: newMealType,
      image_url: imageUrl,
      has_sides: hasSides,
      has_salads: hasSalads,
      database_id: databaseId,
    },
  ])
  .select()
  .single();

  console.log(data);
  console.log(error);

  if (error) {
    alert("Kļūda saglabājot");
    return;
  }

  if (newMealSelectedTags.length > 0) {
  const tagRows =
    newMealSelectedTags.map((tag) => ({
      meal_id: data.id,
tag,
database_id: databaseId,
    }));

  const {
    error: tagError,
  } = await supabase
    .from("meal_tags")
    .insert(tagRows);

  if (tagError) {
    console.log(tagError);
  }
}

  await loadMeals();

alert("Ēdiens saglabāts!");

setNewMealName("");
setNewMealType("");
setNewMealSelectedTags([]);
setNewMealImage(null);
setHasSides(false);
setHasSalads(false);
setCurrentPage("home");
setEditingMeal(null);
}

async function forceSaveMeal() {
  setShowSaveWarning(false);

  let imageUrl = "";

  if (newMealImage) {
    imageUrl = await uploadImage(
      newMealImage
    );
  }

  const { data, error } =
    await supabase
      .from("meals")
      .insert([
        {
          name: newMealName,
          meal_type: newMealType,
          image_url: imageUrl,
          has_sides: hasSides,
          has_salads: hasSalads,
          database_id: databaseId,
        },
      ])
      .select()
      .single();

  if (error) {
    alert("Kļūda saglabājot");
    return;
  }

  if (newMealSelectedTags.length > 0) {
    const tagRows =
      newMealSelectedTags.map(
        (tag) => ({
          meal_id: data.id,
tag,
database_id: databaseId,
        })
      );

    await supabase
      .from("meal_tags")
      .insert(tagRows);
  }

  await loadMeals();

  alert("Ēdiens saglabāts!");

  setNewMealName("");
  setNewMealType("");
  setNewMealSelectedTags([]);
  setNewMealImage(null);
  setHasSides(false);
  setHasSalads(false);
  setCurrentPage("home");
  setEditingMeal(null);
}

async function updateMeal() {
  const { data: existingMeal }
    = await supabase
      .from("meals")
      .select("*")
      .eq("name", editingMeal.name)
      .single();

  if (!existingMeal) return;

  let imageUrl =
    existingMeal.image_url;

  if (newMealImage) {
    imageUrl =
      await uploadImage(
        newMealImage
      );
  }

  await supabase
    .from("meals")
    .update({
      name: newMealName,
      meal_type: newMealType,
      image_url: imageUrl,
      has_sides: hasSides,
      has_salads: hasSalads,
      database_id: databaseId,
    })
    .eq("id", existingMeal.id);

  await supabase
    .from("meal_tags")
    .delete()
    .eq("meal_id", existingMeal.id);

  if (
    newMealSelectedTags.length > 0
  ) {
    await supabase
      .from("meal_tags")
      .insert(
        newMealSelectedTags.map(
          (tag) => ({
            meal_id:
              existingMeal.id,
            tag,
            database_id: databaseId,
          })
        )
      );
  }

  await loadMeals();

resetMealForm();
}

function addToMealPlan(meal) {
  setMealPlan((current) => {
    const alreadyExists = current[meal.type].some(
      (m) => m.name === meal.name
    );

    if (alreadyExists) {
      return current;
    }

    return {
      ...current,
      [meal.type]: [...current[meal.type], meal],
    };
  });
}

function removeFromMealPlan(mealType, mealName) {
  setMealPlan((current) => ({
    ...current,
    [mealType]: current[mealType].filter(
      (meal) => meal.name !== mealName
    ),
  }));
}

function addShoppingItem(category) {
  const item = prompt("Produkts");

  if (!item) return;

  setShoppingList((current) => ({
    ...current,
    [category]: [
      ...current[category],
      item,
    ],
  }));
}

async function deleteMealPlan(id) {

  const { error } =
    await supabase
      .from("meal_plans")
      .delete()
      .eq("id", id);

  if (error) {
    console.log(error);
    alert("Kļūda dzēšot");
    return;
  }

  await loadMealPlans();
}

function removeShoppingItem(
  category,
  index
) {
  setShoppingList((current) => ({
    ...current,
    [category]: current[
      category
    ].filter((_, i) => i !== index),
  }));
}

function renderShoppingCategory(
  title,
  icon,
  key
) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h4
        style={{
          marginBottom: "8px",
          color: "#000",
        }}
      >
        {icon} {title}
      </h4>

      {shoppingList[key].map(
        (item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "6px",
              marginBottom: "4px",
              borderRadius: "8px",
              backgroundColor:
                "#fafafa",
            }}
          >
            <span>{item}</span>

            <button
              onClick={() =>
                removeShoppingItem(
                  key,
                  index
                )
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
              }}
            >
              ❌
            </button>
          </div>
        )
      )}

      <button
        onClick={() =>
          addShoppingItem(key)
        }
        style={{
          width: "140px",
          padding: "6px 12px",
          borderRadius: "12px",
          border: "2px solid #7CB342",
          backgroundColor: "#E8F5E9",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ✚ Pievienot
      </button>
    </div>
  );
}

async function loadUserDatabases(userId) {

  const { data, error } =
    await supabase
      .from("user_databases")
      .select("*")
      .eq(
        "user_id",
        userId
      );

  if (error) {
    console.log(error);
    return;
  }

setHasDatabase(
  data.length > 0
);

if (data.length > 0) {

  const dbId =
    data[0].database_id;

  setDatabaseId(dbId);

  await loadDatabaseInfo(dbId);
  setLoadingDatabase(false);

  if (error) {
  console.log(error);
  setLoadingDatabase(false);
  return;
}
}
}

async function loadDatabaseInfo(id) {

  const { data, error } =
    await supabase
      .from("meal_databases")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {
    console.log(error);
    return;
  }

  setDatabaseName(data.name);
}

async function loadMealPlans() {

  const { data, error } =
    await supabase
      .from("meal_plans")
.select("*")
.eq(
  "user_id",
  session.user.id
)
.order("id", {
        ascending: false,
      });

  if (error) {
    console.log(error);
    return;
  }

  setSavedMealPlans(data);
}

async function loadMeals() {
if (!databaseId) return;

const {
  data: mealsData,
  error: mealsError
} =
  await supabase
    .from("meals")
    .select("*")
    .eq(
      "database_id",
      databaseId
    );

  if (mealsError) {
    console.log(mealsError);
    return;
  }

const {
  data: tagsData,
  error: tagsError
} =
  await supabase
    .from("meal_tags")
    .select("*")
    .eq(
      "database_id",
      databaseId
    );

  if (tagsError) {
    console.log(tagsError);
    return;
  }

const { data: sidesData } =
  await supabase
    .from("meal_sides")
    .select("*")
    .eq(
      "database_id",
      databaseId
    );

const { data: saladsData } =
  await supabase
    .from("meal_salads")
    .select("*")
    .eq(
      "database_id",
      databaseId
    );

    setAllSides(
  [...new Set(
    sidesData.map(
      (side) => side.side_name
    )
  )]
);

setAllSalads(
  [...new Set(
    saladsData.map(
      (salad) => salad.salad_name
    )
  )]
);

  const formattedMeals = mealsData.map(
    (meal) => ({
      name: meal.name,
      type: meal.meal_type,

      tags: tagsData
        .filter(
          (tag) =>
            tag.meal_id === meal.id
        )
        .map((tag) => tag.tag),

      image: meal.image_url,

        hasSides: meal.has_sides,
        hasSalads: meal.has_salads,
    })
  );



  setMeals(formattedMeals);
}

useEffect(() => {

  if (!databaseId) return;

  loadMeals();

}, [databaseId]);

useEffect(() => {

  const getSession = async () => {

    const {
      data: { session }
    } = await supabase.auth.getSession();

    setSession(session);

    if (session) {
      loadUserDatabases(
        session.user.id);
      loadMealPlans();
    }
  };

  getSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {

      setSession(session);

      if (session) {
        loadUserDatabases(
          session.user.id);
        loadMealPlans();
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };

}, []);

const filteredMeals = meals.filter((meal) => {
  if (meal.type !== mealType) return false;

  return selectedTags.every((tag) =>
    meal.tags.includes(tag)
  );
});

async function attachTomDatabase() {

  const { error } =
    await supabase
      .from("user_databases")
      .insert([
        {
          user_id:
            session.user.id,

          database_id: 1,
        },
      ]);

  if (error) {
    console.log(error);
    alert("Kļūda");
    return;
  }

  setHasDatabase(true);
  setDatabaseId(1);
  await loadUserDatabases(
    session.user.id
  );
  setCurrentPage("home");
}

async function createDatabase() {

if (!newDatabaseName.trim()) {
  alert("Ievadi nosaukumu");
  return;
}

  const { data, error } =
    await supabase
      .from("meal_databases")
      .insert([
        {
          name:
            newDatabaseName
        },
      ])
      .select()
      .single();

  if (error) {
    console.log(error);
    return;
  }

  await supabase
    .from("user_databases")
    .insert([
      {
        user_id:
          session.user.id,

        database_id:
          data.id,
      },
    ]);

  setHasDatabase(true);
  setDatabaseId(data.id);
  await loadDatabaseInfo(data.id);
  setCurrentPage("addMeal");
  setNewDatabaseName("");
setShowCreateDbPopup(false);
}

async function addNewSide() {
  const sideName = prompt(
    "Piedevas nosaukums"
  );

  if (!sideName) return;

await supabase
  .from("meal_sides")
  .insert([
    {
      side_name: sideName,
      database_id: databaseId,
    },
  ]);

  loadMeals();
}

async function deleteSide(sideName) {
  await supabase
    .from("meal_sides")
    .delete()
    .eq("side_name", sideName);

  setSelectedSideItem(null);

  loadMeals();
}

async function removeDatabase() {

  await supabase
    .from("user_databases")
    .delete()
    .eq(
      "user_id",
      session.user.id
    );

  setHasDatabase(false);
  setDatabaseId(null);
  setDatabaseName("");
}

async function renameSide(oldName) {
  const newName = prompt(
    "Jaunais nosaukums",
    oldName
  );

  if (!newName) return;

  await supabase
    .from("meal_sides")
    .update({
      side_name: newName,
    })
    .eq("side_name", oldName);

  setSelectedSideItem(null);

  loadMeals();
}

async function deleteSalad(saladName) {
  await supabase
    .from("meal_salads")
    .delete()
    .eq("salad_name", saladName);

  setSelectedSaladItem(null);

  loadMeals();
}

async function renameSalad(oldName) {
  const newName = prompt(
    "Jaunais nosaukums",
    oldName
  );

  if (!newName) return;

  await supabase
    .from("meal_salads")
    .update({
      salad_name: newName,
    })
    .eq("salad_name", oldName);

  setSelectedSaladItem(null);

  loadMeals();
}

async function addNewSalad() {
  const saladName = prompt(
    "Salātu nosaukums"
  );

  if (!saladName) return;

await supabase
  .from("meal_salads")
  .insert([
    {
      salad_name: saladName,
      database_id: databaseId,
    },
  ]);

  loadMeals();
}

async function startEditMeal(meal) {
  setEditingMeal(meal);

  setNewMealName(meal.name);

  setNewMealType(meal.type);

  setNewMealSelectedTags(
    meal.tags || []
  );

  setHasSides(
    meal.hasSides || false
  );

  setHasSalads(
    meal.hasSalads || false
  );

  setShowEditPopup(true);
}

if (!session) {

  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "20px",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Ko ēdīsim?
      </h1>

      <button
        onClick={signInGoogle}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "2px solid #000",
          backgroundColor: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#000",
        }}
      >
        🔐 Pieslēgties ar Google
      </button>

    </div>
  );
}

if (session && loadingDatabase) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
      }}
    >
      Ielādē...
    </div>
  );
}

if (
  session &&
  !hasDatabase
) {
  return (
    <>
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "20px",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Ko ēdīsim?
      </h1>

      <button
        onClick={
          attachTomDatabase
        }
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: "12px",
          borderRadius: "12px",
          border:
            "2px solid #000",
          backgroundColor:
            "#fff",
          fontWeight: "bold",
          color: "#000",
          fontSize: "18px",
        }}
      >
        📦 Ielādēt noklusējuma datubāzi
      </button>

      <button
        onClick={() =>
          setShowCreateDbPopup(true)
        }
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border:
            "2px solid #000",
          backgroundColor:
            "#fff",
          fontWeight: "bold",
          color: "#000",
          fontSize: "18px",
        }}
      >
        ➕ Veidot jaunu datubāzi
      </button>

    </div>
      {showCreateDbPopup && (
  <div
    onClick={() =>
      setShowCreateDbPopup(false)
    }
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor:
        "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "320px",
      }}
    >

      <h3>
        Jauna datubāze
      </h3>

      <input
        value={newDatabaseName}
        onChange={(e) =>
          setNewDatabaseName(
            e.target.value
          )
        }
        placeholder="Datubāzes nosaukums"
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={
          createDatabase
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
        }}
      >
        Izveidot jaunu datubāzi
      </button>

    </div>
  </div>
)}

</> 
  );
}

if (currentPage === "mealPlans") {
  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "12px",
      }}
    >
<TopNavigation />

<h1 style={pageTitleStyle}>
Ēdienkartes
</h1>

{savedMealPlans.length === 0 && (
  <p
    style={{
      textAlign: "center",
      color: "#666",
      fontSize: "16px",
      marginTop: "30px",
    }}
  >
    Nav saglabātu ēdienkaršu
  </p>
)}

{savedMealPlans.map((plan) => (
  <div
    key={plan.id}
    style={{
      border: "2px solid #000",
      borderRadius: "12px",
      padding: "12px",
      marginBottom: "12px",
      position: "relative",
    }}
  >
    <button
  onClick={() =>
    deleteMealPlan(plan.id)
  }
  style={{
    position: "absolute",
    top: "8px",
    right: "8px",

    width: "24px",
    height: "24px",

    borderRadius: "50%",
    border: "1px solid #000",

    backgroundColor: "#fff",

    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "16px",
    fontWeight: "bold",

    padding: 0,
    lineHeight: 1,
  }}
>
  −
</button>

{Object.entries(plan.plan)
  .filter(
    ([, meals]) =>
      meals.length > 0
  )
  .map(([type, meals]) => (
    <div key={type}>
      <b>{type}</b>

      {meals.map((meal) => (
        <div key={meal.name}>
          • {meal.name}
        </div>
      ))}
    </div>
))}

    </div>
))}
</div>
);
}

if (currentPage === "settings") {
  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "12px",
      }}
    >
      <TopNavigation />

      <h1
        style={pageTitleStyle}>
        Iestatījumi
      </h1>

     <div
  style={{
    border: "2px solid #000",
    borderRadius: "12px",
    padding: "12px",
  }}
>

  <p>
    <b>Lietotājs:</b>
  </p>

  <p>
    {session.user.email}
  </p>

  <hr />

  <p>
    <b>Aktīvā datubāze:</b>
  </p>

  <p>
    {databaseName}
  </p>

  <hr />

<button
  onClick={removeDatabase}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "2px solid #B71C1C",
    backgroundColor: "#EF5350",
    color: "#000",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  📦 Noņemt datubāzi no konta
</button>

<button
  onClick={signOut}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid #000",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Iziet
</button>

</div>
    </div>
  );
}

if (currentPage === "addMeal") {
  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "12px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
   
   <TopNavigation />

<h1 style={pageTitleStyle}
>
  {editingMeal
    ? "Rediģēt ēdienu"
    : "Jauns ēdiens"}
</h1>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "10px",
  }}
>
  {addMealCards.map((card) => (
    <button
      key={card.value}
      onClick={() => {
        if (card.value === "addSide") {
  setShowSidesPopup(true);
  return;
}

if (card.value === "addSalad") {
  setShowSaladsPopup(true);
  return;
}

        const nextType = 
          newMealType === card.value
            ? ""
            : card.value;

          setNewMealType(nextType);
          setNewMealSelectedTags([]);
          setHasSides(false);
          setHasSalads(false);
      }}
      style={{
        padding: "12px",
        borderRadius: "12px",
        fontWeight: "bold",
        fontSize: "16px",
        border:
          newMealType === card.value
            ? "3px solid #0D4715"
            : "3px solid black",
        backgroundColor:
          newMealType === card.value
            ? "#4CAF50"
            : "#f5f5f5",
        color:
          newMealType === card.value
            ? "white"
            : "black",
        cursor: "pointer",
      }}
    >
      {card.label}
    </button>
  ))}
</div>

{newMealType && <DoubleLine />}

{showSidesPopup && (
  <div
    onClick={() =>
      setShowSidesPopup(false)
    }
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor:
        "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        backgroundColor: "white",
        width: "90%",
        maxWidth: "320px",
        padding: "16px",
        borderRadius: "16px",
      }}
    >
      <h3
  style={{
    marginTop: 0,
    textAlign: "center",
    color: "#000",
  }}
>
  🍚 Piedevas
</h3>

<button
  onClick={addNewSide}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  ➕ Jaunas piedevas
</button>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  }}
>
  {allSides.map((side) => (
    <div
  key={side}
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "16px",
    backgroundColor: "#E0E0E0",
    fontWeight: "normal",
    fontSize: "13px",
    color: "#000",
    position: "relative",
  }}
>
      <span
  style={{
    textAlign: "center",
    width: "100%",
  }}
>
  {side}
</span>

      <button
        onClick={() =>
          setSelectedSideItem(side)
        }
        style={{
          border: "none",
          background: "transparent",
          color: "#2E7D32",
          fontSize: "22px",
          fontWeight: "bold",
          lineHeight: "1",
          cursor: "pointer",
        }}
        >
⋮
        </button>
    </div>
  ))}
  </div>
  </div>
  </div>
)}

{selectedSideItem && (
  <div
    onClick={() =>
      setSelectedSideItem(null)
    }
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1100,
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "16px",
        width: "280px",
      }}
    >
      
<h3
  style={{
    color: "#000",
    textAlign: "center",
    marginTop: 0,
    marginBottom: "16px",
  }}
>
  {selectedSideItem}
</h3>

<button
  onClick={() =>
    renameSide(selectedSideItem)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "12px",
    border: "2px solid #F57F17",
    backgroundColor: "#FDD835",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  ✏️ Pārsaukt
</button>

<button
  onClick={() =>
    deleteSide(selectedSideItem)
  }
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid #B71C1C",
    backgroundColor: "#EF5350",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  🗑️ Dzēst
</button>

    </div>
  </div>
)}

{showSaladsPopup && (
  <div
    onClick={() =>
      setShowSaladsPopup(false)
    }
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor:
        "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        backgroundColor: "white",
        width: "90%",
        maxWidth: "320px",
        padding: "16px",
        borderRadius: "16px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          textAlign: "center",
          color: "#000",
        }}
      >
        🥗 Salāti
      </h3>

      <button
        onClick={addNewSalad}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#4CAF50",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ➕ Jauni salāti
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "8px",
        }}
      >
        {allSalads.map((salad) => (
          <div
            key={salad}
            style={{
              display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "16px",
    backgroundColor: "#E0E0E0",
    fontWeight: "normal",
    fontSize: "13px",
    color: "#000",
    position: "relative",
            }}
          >
            <span
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {salad}
            </span>

            <button
              onClick={() =>
                setSelectedSaladItem(
                  salad
                )
              }
              style={{
                border: "none",
          background: "transparent",
          color: "#2E7D32",
          fontSize: "22px",
          fontWeight: "bold",
          lineHeight: "1",
          cursor: "pointer",
              }}
            >
              ⋮
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{selectedSaladItem && (
  <div
    onClick={() =>
      setSelectedSaladItem(null)
    }
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1100,
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "16px",
        width: "280px",
      }}
    >
<h3
  style={{
    color: "#000",
    textAlign: "center",
    marginTop: 0,
    marginBottom: "16px",
  }}
>
  {selectedSaladItem}
</h3>

<button
  onClick={() =>
    renameSalad(selectedSaladItem)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "12px",
    border: "2px solid #F57F17",
    backgroundColor: "#FDD835",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  ✏️ Pārsaukt
</button>

<button
  onClick={() =>
    deleteSalad(selectedSaladItem)
  }
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid #B71C1C",
    backgroundColor: "#EF5350",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  🗑️ Dzēst
</button>
    </div>
  </div>
)}

{showSaveWarning && (
  <div
    onClick={() =>
      setShowSaveWarning(false)
    }
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1200,
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        backgroundColor: "white",
        width: "90%",
        maxWidth: "320px",
        padding: "16px",
        borderRadius: "16px",
      }}
    >
      <h3
        style={{
          color: "#000",
          textAlign: "center",
          marginTop: 0,
          marginBottom: "8px",
        }}
      >
        ⚠️ Uzmanību
      </h3>

      <div
  style={{
    color: "#000",
    textAlign: "center",
    marginBottom: "12px",
  }}
>
  {newMealType !== "Deserts" &&
  newMealSelectedTags.length === 0 && (
    <div>
      🏷️ Nav izvēlēts neviens filtrs
    </div>
)}

  {!newMealImage && (
    <div>🖼️ Nav pievienota bilde</div>
  )}
</div>

{newMealType !== "Deserts" &&
newMealSelectedTags.length === 0 && (
      <button
  onClick={() =>
    setShowSaveWarning(false)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "12px",
    border: "2px solid #1B5E20",
    backgroundColor: "#4CAF50",
    color: "#000",
    fontWeight: "bold",
  }}
>
  🏷️ Pievienot filtru
</button>
)}

{!newMealImage && (
<button
  onClick={() => {
    galleryInputRef.current?.click();
  }}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "12px",
    border: "2px solid #1976D2",
    backgroundColor: "#64B5F6",
    color: "#000",
    fontWeight: "bold",
  }}
>
  🖼️ Pievienot bildi
</button>
)}

<button
  onClick={forceSaveMeal}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid #F57F17",
    backgroundColor: "#FDD835",
    color: "#000",
    fontWeight: "bold",
  }}
>
  ✅ Tomēr pievienot
</button>
    </div>
  </div>
)}

{newMealType && (
<textarea
  placeholder="Ēdiena nosaukums"
  value={newMealName}
  onChange={(e) =>
    setNewMealName(e.target.value)
  }
  rows={1}
  style={{
    width: "90%",
    fontSize: "16px",
    padding: "8px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    margin: "0 auto",
    display: "block",
    boxSizing: "border-box",
    resize: "none",
    overflow: "hidden",
  }}
  onInput={(e) => {
    e.target.style.height = "auto";
    e.target.style.height =
      e.target.scrollHeight + "px";
  }}
/>
)}

{newMealType && (
  newMealType !== "Deserts"
) && <DoubleLine />}

{newMealType &&
  filterGroups[newMealType]?.length > 0 && (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  }}
>
  {filterGroups[newMealType]?.map(
    (group, index) => (
      <div
        key={index}
        style={{
          display: "grid",
          gridTemplateColumns:
            group.length === 2
              ? "1fr 1fr"
              : group.length === 3
              ? "1fr 1fr 1fr"
              : group.length === 4
              ? "1fr 1fr 1fr 1fr"
              : "1fr",
          gap: "8px",
          width: "100%",
        }}
      >
        {group.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              toggleNewMealTag(tag)
            }
            style={{
              padding: "10px",
              borderRadius: "12px",
              fontSize: "15px",
              border:
                newMealSelectedTags.includes(tag)
                  ? "2px solid #0D4715"
                  : "2px solid black",
              backgroundColor:
                newMealSelectedTags.includes(tag)
                  ? "#4CAF50"
                  : "#f5f5f5",
              color:
                newMealSelectedTags.includes(tag)
                  ? "white"
                  : "black",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    )
  )}
</div>
  )}

  {(
  newMealType === "Pusdienas" ||
  newMealType === "Vakariņas"
) && <DoubleLine />}

<div
  style={{
    gridTemplateColumns: "1fr 1fr",
  }}
>

{(
  newMealType === "Pusdienas" ||
  newMealType === "Vakariņas"
) && (
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "0",
  }}
>

  <button
    type="button"
    onClick={() =>
      setHasSides(!hasSides)
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      border: hasSides
        ? "2px solid #1B5E20"
        : "2px solid #000",
      backgroundColor: hasSides
        ? "#4CAF50"
        : "#f5f5f5",
      color: hasSides
        ? "#fff"
        : "#000",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    🍚 Ir piedevas
  </button>

  <button
    type="button"
    onClick={() =>
      setHasSalads(!hasSalads)
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      border: hasSalads
        ? "2px solid #1B5E20"
        : "2px solid #000",
      backgroundColor: hasSalads
        ? "#4CAF50"
        : "#f5f5f5",
      color: hasSalads
        ? "#fff"
        : "#000",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    🥗 Ir salāti
  </button>

</div>
)}

{(
  newMealType === "Pusdienas" ||
  newMealType === "Vakariņas"
) && <DoubleLine />}

{newMealType === "Brokastis" && (
  <DoubleLine />
)}

{newMealType === "Deserts" && (
  <DoubleLine />
)}

{newMealType && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "0",
    }}
  >

    <button
      type="button"
      onClick={() =>
        galleryInputRef.current.click()
      }
      style={{
        padding: "8px 12px",
        borderRadius: "12px",
        fontWeight: "bold",
        fontSize: "15px",
        border: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        color: "black",
        cursor: "pointer",
      }}
    >
      🖼️ Bilde
    </button>
  </div>
)}

</div>

<input
  ref={galleryInputRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMealImage(file);
      setShowSaveWarning(false);
    }
  }}
/>

{newMealImage && (
  <img
    src={URL.createObjectURL(newMealImage)}
    alt="Priekšskatījums"
    style={{
      width: "40%",
      maxWidth: "140px",
      display: "block",
      margin: "12px auto 0 auto",
      borderRadius: "12px",
      marginTop: "12px",
    }}
  />
)}

{newMealType &&
 newMealName.trim() && (
  <button
    onClick={
      editingMeal
      ? updateMeal
      : saveMeal
    }
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "16px",
      borderRadius: "16px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "2px solid #1B5E20",
      fontWeight: "bold",
      fontSize: "18px",
      cursor: "pointer",
    }}
  >
    {editingMeal
  ? "💾 Saglabāt"
  : "✅ Pievienot"}
  </button>
)}

    </div>
  );
}

function isInMealPlan(meal) {
  return mealPlan[meal.type]?.some(
    (m) => m.name === meal.name
  );
}

  return (
    <div
      style={{
        maxWidth: "380px",
        width: "100%",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "12px",
        fontFamily: "Arial",
        overflowX: "hidden",
      }}
    >

<TopNavigation />

<h1 style={pageTitleStyle}>
  Ko ēdīsim?
</h1>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "10px",
  }}
>
  
  {mealTypes.map((type) => (
      <button
        key={type.value}
onClick={() => {
  if (mealType === type.value) {
    setMealType("");
  } else {
    setMealType(type.value);
  }

  setSelectedTags([]);
}}
        style={{
  padding: "12px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "16px",
  border:
    mealType === type.value
      ? "3px solid #0D4715"
      : "3px solid black",
  backgroundColor:
    mealType === type.value
      ? "#4CAF50"
      : "#f5f5f5",
  color:
    mealType === type.value
      ? "white"
      : "black",
  cursor: "pointer",
}}
      >
        {type.label}
      </button>
    )
  )}
</div>

{mealType && <DoubleLine />}

{mealType &&
filterGroups[mealType]?.length > 0 && (
  <>
<div
style={{
  backgroundColor: "transparent",
  padding: "0",
  borderRadius: "16px",
  marginBottom: "0",
  border: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  }}
>
{filterGroups[mealType]?.map(
  (group, index) => (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns:
  group.length === 2
    ? "1fr 1fr"
    : group.length === 3
    ? "1fr 1fr 1fr"
    : group.length === 4
    ? "1fr 1fr 1fr 1fr"
    : "1fr",
        gap: "8px",
        width: "100%",
        marginBottom: "0px",
      }}
    >
      {group.map((tag) => (
        <button
          key={tag}
          onClick={() =>
            toggleTag(tag)
          }
          style={{
            padding: "10px",
            borderRadius: "12px",
            fontSize: "15px",
            border: selectedTags.includes(tag)
  ? "3px solid #0D4715"
  : "3px solid black",
            fontWeight: "bold",
            backgroundColor:
              selectedTags.includes(tag)
                ? "#4CAF50"
                : "#f5f5f5",
            color:
              selectedTags.includes(tag)
                ? "white"
                : "black",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  )
)}
</div>

<DoubleLine />

</>
  )}

      {mealType && (
        <>
      {filteredMeals.length === 0 ? (
        <p>Nav atrastu ēdienu</p>
      ) : (
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  }}
>
  {filteredMeals.map((meal) => (
    <div
      key={meal.name}

onTouchStart={() => {
  longPressRef.current =
    setTimeout(() => {
      startEditMeal(meal);
    }, 700);
}}

onTouchEnd={() => {
  clearTimeout(longPressRef.current);
}}

onClick={() => {
  if (isInMealPlan(meal)) {
    removeFromMealPlan(
      meal.type,
      meal.name
    );
  } else if (
    meal.hasSides ||
    meal.hasSalads
  ) {
    setSelectedMeal(meal);
  } else {
    addToMealPlan(meal);
  }
}}
      style={{
        position: "relative",
        padding: "6px",
        marginTop: "6px",
        border: isInMealPlan(meal)
        ? "2px solid #FBC02D"
        : "2px solid #000",
        borderRadius: "10px",
        cursor: "pointer",
        backgroundColor: isInMealPlan(meal)
        ? "#FFF59D"
        : "#fafafa",
        color: "#222",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >

      {meal.image && (
        <img
        src={meal.image}
        alt={meal.name}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "0px",
        }}
        />
      )}
<strong
  style={{
    display: "block",
    fontSize: "13px",
    lineHeight: "1",
    userSelect: "none",
    WebkitUserSelect: "none",
  }}
>
  {meal.name}
</strong>
      </div>
  ))}
</div>
      )}
      </>
      )}

{selectedMeal && (
  <div
    onClick={() => {
      setSelectedMeal(null);
      setSelectedSide("");
      setSelectedSalad("");
    }}
  style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: "white",
        padding: "12px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "320px",
        maxHeight: "85vh",
        overflowY: "auto",
        margin: "0 auto",
      }}
    >
      <h3
  style={{
    
    color: "#000",
    textAlign: "center",
    marginTop: "-8px",
    marginBottom: "6px",
  }}
>
  {selectedMeal.name}
</h3>

{selectedMeal.image && (
  <img
    src={selectedMeal.image}
    alt={selectedMeal.name}
    style={{
      width: "60%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "12px",
      marginBottom: "-12px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    }}
  />
)}

{selectedMeal.hasSides && (
  <>
    <h4
  style={{
    
    color: "#000",
    marginBottom: "8px",
    clear: "both",
  }}
>
  🍚 Piedevas
</h4>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  }}
>
  {allSides.map((side) => (
    <div
      key={side}
      onClick={() =>
        setSelectedSide(
          selectedSide === side
          ? ""
          : side
        )
      }
style={{
  padding: "4px 6px",
  borderRadius: "10px",
  border: selectedSide === side
    ? "2px solid #2E7D32"
    : "2px solid #ddd",
  backgroundColor:
    selectedSide === side
      ? "#A5D6A7"
      : "#fafafa",
  cursor: "pointer",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
  fontWeight: "600",
  color: "#000",
}}
    >
      {side}
    </div>
  ))}
</div>
  </>
)}

{selectedMeal.hasSalads && (
  <>
    <h4
  style={{
    color: "#000",
    marginTop: "8px",
    marginBottom: "8px",
  }}
>
  🥗 Salāti
</h4>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  }}
>
  {allSalads.map((salad) => (
    <div
      key={salad}
      onClick={() =>
        setSelectedSalad(
          selectedSalad === salad
        ? ""
        : salad
      )
      }
      style={{
  padding: "4px 6px",
  borderRadius: "10px",
  border: selectedSalad === salad
    ? "2px solid #2E7D32"
    : "2px solid #ddd",
  backgroundColor:
    selectedSalad === salad
      ? "#A5D6A7"
      : "#fafafa",
  cursor: "pointer",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
  fontWeight: "600",
  color: "#000",
}}
    >
      {salad}
    </div>
  ))}
</div>
  </>
)}

      <button
onClick={() => {
  addToMealPlan({
    ...selectedMeal,

    side: selectedSide,

    salad: selectedSalad,
  });

  setSelectedMeal(null);
  setSelectedSide("");
  setSelectedSalad("");
}}
style={{
    width: "100%",
    marginTop: "16px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  }}
      >
        Ēdīsim šo
      </button>
    </div>
  </div>
)}

{showEditPopup && (
  <div
onClick={() => {
  setShowEditPopup(false);
  resetMealForm();
}}
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor:
        "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1500,
      padding: "12px",
    }}
  >
    <div
      onClick={(e) =>
        e.stopPropagation()
      }
      style={{
        backgroundColor: "white",
        width: "100%",
        maxWidth: "360px",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "16px",
        padding: "16px",
      }}
    >

      <h2
        style={{
          textAlign: "center",
          marginTop: 0,
          color: "#000",
          marginBottom: "12px",
        }}
      >
        🛠️ Rediģēt ēdienu
      </h2>

      <textarea
  value={newMealName}
  onChange={(e) =>
    setNewMealName(
      e.target.value
    )
  }
  rows={1}
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    resize: "none",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "16px",
  }}
/>

<DoubleLine />

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "8px",
    marginTop: "12px",
  }}
>

 {mealTypes.map((type) => (
  <button
    key={type.value}
    onClick={() =>
      setNewMealType(type.value)
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      border:
        newMealType === type.value
          ? "3px solid #0D4715"
          : "3px solid black",

      backgroundColor:
        newMealType === type.value
          ? "#4CAF50"
          : "#f5f5f5",

      color:
        newMealType === type.value
          ? "white"
          : "black",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    {type.label}
  </button>
))}
</div>

<DoubleLine />

{newMealType &&
  filterGroups[newMealType]?.length > 0 && (

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  }}
>
  {filterGroups[newMealType]?.map(
    (group, index) => (
      <div
        key={index}
        style={{
          display: "grid",
          gridTemplateColumns:
            group.length === 2
              ? "1fr 1fr"
              : group.length === 3
              ? "1fr 1fr 1fr"
              : group.length === 4
              ? "1fr 1fr 1fr 1fr"
              : "1fr",
          gap: "8px",
          width: "100%",
        }}
      >
        {group.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              toggleNewMealTag(tag)
            }
            style={{
              padding: "10px",
              borderRadius: "12px",
              fontSize: "14px",
              border:
                newMealSelectedTags.includes(tag)
                  ? "2px solid #0D4715"
                  : "2px solid black",
              backgroundColor:
                newMealSelectedTags.includes(tag)
                  ? "#4CAF50"
                  : "#f5f5f5",
              color:
                newMealSelectedTags.includes(tag)
                  ? "white"
                  : "black",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    )
  )}
</div>
  )}

  <DoubleLine />

{(
  newMealType === "Pusdienas" ||
  newMealType === "Vakariņas"
) && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginTop: "12px",
    }}
  >

  <button
    type="button"
    onClick={() =>
      setHasSides(!hasSides)
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      border: hasSides
        ? "2px solid #1B5E20"
        : "2px solid #000",
      backgroundColor: hasSides
        ? "#4CAF50"
        : "#f5f5f5",
      color: hasSides
        ? "#fff"
        : "#000",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    🍚 Ir piedevas
  </button>

  <button
    type="button"
    onClick={() =>
      setHasSalads(!hasSalads)
    }
    style={{
      padding: "12px",
      borderRadius: "12px",
      border: hasSalads
        ? "2px solid #1B5E20"
        : "2px solid #000",
      backgroundColor: hasSalads
        ? "#4CAF50"
        : "#f5f5f5",
      color: hasSalads
        ? "#fff"
        : "#000",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    🥗 Ir salāti
  </button>
  </div>
)}


<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "12px",
  }}
>
  <button
    type="button"
    onClick={() =>
      galleryInputRef.current.click()
    }
    style={{
      padding: "8px 12px",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "15px",
      border: "2px solid #000",
      backgroundColor: "#f5f5f5",
      color: "black",
      cursor: "pointer",
    }}
  >
    🖼️ Mainīt bildi
  </button>
</div>

<input
  ref={galleryInputRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (file) {
      setNewMealImage(file);
    }
  }}
/>

{editingMeal?.image && !newMealImage && (
  <img
    src={editingMeal.image}
    alt=""
    style={{
      width: "40%",
      maxWidth: "140px",
      display: "block",
      margin: "12px auto",
      borderRadius: "12px",
    }}
  />
)}
{newMealImage && (
  <img
    src={URL.createObjectURL(
      newMealImage
    )}
    alt=""
    style={{
      width: "40%",
      maxWidth: "140px",
      display: "block",
      margin: "12px auto",
      borderRadius: "12px",
    }}
  />
)}



<button
  onClick={async () => {
    setShowEditPopup(false);
    updateMeal();
  }}
  style={{
    width: "100%",
    marginTop: "16px",
    padding: "14px",
    borderRadius: "16px",
    border: "2px solid #1B5E20",
    backgroundColor:
      "#4CAF50",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
  }}
>
  💾 Saglabāt
</button>


    </div>
  </div>
)}

{Object.values(mealPlan).some(
  (meals) => meals.length > 0
) && <DoubleLine />}

{Object.values(mealPlan).some(
  (meals) => meals.length > 0
) && (
  
<div
  style={{
    backgroundColor: "#F5F5F5",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #E0E0E0",
    marginTop: "8px",
  }}
>

<h3
      style={{
        textAlign: "center",
        marginTop: "0px",
        marginBottom: "12px",
        color: "#000",
        fontSize: "20px",
      }}
    >
      Ēdienkarte
    </h3>

<button
  onClick={saveMealPlan}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "2px solid #1B5E20",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
  }}
>
  💾 Saglabāt ēdienkarti
</button>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >

    {Object.entries(mealPlan)
      .filter(([, meals]) => meals.length > 0)
      .map(([mealType, meals]) => (
        <div key={mealType}>
<h4
  style={{
    textAlign: "center",
    marginTop: "0px",
    marginBottom: "8px",
    color: "#000",
  }}
>
  {mealType === "Brokastis" && "🍳 "}
  {mealType === "Pusdienas" && "🍝 "}
  {mealType === "Vakariņas" && "🥩 "}
  {mealType === "Deserts" && "🍰 "}
  {mealType}
</h4>

          {meals.map((meal) => (
            <div
              key={meal.name}
              onClick={() =>
                removeFromMealPlan(
                  mealType,
                  meal.name
                )
              }
              style={{
                padding: "6px",
                marginBottom: "6px",
                border: "2px solid #FBC02D",
                borderRadius: "8px",
                backgroundColor: "#FFF59D",
                color: "#222",
                cursor: "pointer",
              }}
            >
             <div
  style={{
    fontSize: "12px",
    fontWeight: "bold",
    lineHeight: "1.2",
  }}
>
  {meal.name}
</div>

{meal.side && (
  <div
    style={{
      fontSize: "10px",
      marginTop: "2px",
    }}
  >
    🍚 {meal.side}
  </div>
)}

{meal.salad && (
  <div
    style={{
      fontSize: "10px",
    }}
  >
    🥗 {meal.salad}
  </div>
)}
            </div>
          ))}
        </div>
      ))}

    
    {/* viss pārējais ēdienkartes saturs */}
  </div>
</div>
)}

{Object.values(mealPlan).some(
  (meals) => meals.length > 0
) && <DoubleLine />}

{Object.values(mealPlan).some(
  (meals) => meals.length > 0
) && (

<div
  style={{
    backgroundColor: "#F5F5F5",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #E0E0E0",
    marginTop: "0",
  }}
>
  <h3
    style={{
      textAlign: "center",
      marginTop: 0,
      color: "#000",
    }}
  >
    🛒 Iepirkumu saraksts
  </h3>

  {renderShoppingCategory(
    "Dārzeņi",
    "🥦",
    "vegetables"
  )}

  {renderShoppingCategory(
    "Augļi",
    "🍎",
    "fruits"
  )}

  {renderShoppingCategory(
    "Gaļa / Zivs",
    "🥩",
    "meatFish"
  )}

  {renderShoppingCategory(
    "Piena produkti",
    "🥛",
    "dairy"
  )}

  {renderShoppingCategory(
    "Graudaugi",
    "🌾",
    "grains"
  )}
</div>
      )}

  </div>
  );
}