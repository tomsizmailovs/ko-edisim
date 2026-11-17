import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

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
    ["Salds", "Sāļš"],
    ["Silts", "Auksts"],
    ["Olas", "Maize", "Pankūkas"],
    ["15 min"],
  ],

  Pusdienas: [
    ["Salds", "Sāļš"],
    ["Silts", "Auksts"],
    ["Zupa", "Nezupa"],
    ["15 min"],
  ],

  Vakariņas: [
    ["Silts", "Auksts"],
    ["Vista", "Cūka"],
    ["Liellops", "Zivs"],
  ],

  Deserts: [
  ],
};

export default function App() {
  const galleryInputRef = useRef(null);
  const [mealType, setMealType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [meals,setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedSide, setSelectedSide] = useState("");
  const [selectedSalad, setSelectedSalad] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
const [newMealName, setNewMealName] =
  useState("");

  const DoubleLine = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "12px",
      marginBottom: "12px",
    }}
  >
    <hr
      style={{
        border: "none",
        borderTop: "3px solid #d0d0d0",
        width: "100%",
        margin: 0,
      }}
    />

    <hr
      style={{
        border: "none",
        borderTop: "3px solid #d0d0d0",
        width: "100%",
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

const [mealPlan, setMealPlan] = useState(() => {
  const savedPlan =
      localStorage.getItem("mealPlan");

  return savedPlan
    ? JSON.parse(savedPlan)
    : {
        Brokastis: [],
        Pusdienas: [],
        Vakariņas: [],
        Deserts:[],
      };
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

  // Olas / Maize / Pankūkas

if (tag === "Olas") {
  newTags = newTags.filter(
    (t) =>
      t !== "Maize" &&
      t !== "Pankūkas"
  );
}

if (tag === "Maize") {
  newTags = newTags.filter(
    (t) =>
      t !== "Olas" &&
      t !== "Pankūkas"
  );
}

if (tag === "Pankūkas") {
  newTags = newTags.filter(
    (t) =>
      t !== "Olas" &&
      t !== "Maize"
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

  // Olas / Maize / Pankūkas

  if (tag === "Olas") {
    newTags = newTags.filter(
      (t) =>
        t !== "Maize" &&
        t !== "Pankūkas"
    );
  }

  if (tag === "Maize") {
    newTags = newTags.filter(
      (t) =>
        t !== "Olas" &&
        t !== "Pankūkas"
    );
  }

  if (tag === "Pankūkas") {
    newTags = newTags.filter(
      (t) =>
        t !== "Olas" &&
        t !== "Maize"
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

  // Vista / Cūka / Liellops / Zivs

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
  newMealSelectedTags.length === 0 &&
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

  const [showSaveWarning,
      setShowSaveWarning]
      = useState(false);

const { data, error } = await supabase
  .from("meals")
  .insert([
    {
      name: newMealName,
      meal_type: newMealType,
      image_url: imageUrl,
      has_sides: hasSides,
      has_salads: hasSalads,
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

async function loadMeals() {
  const { data: mealsData, error: mealsError } =
    await supabase
      .from("meals")
      .select("*");

  if (mealsError) {
    console.log(mealsError);
    return;
  }

  const { data: tagsData, error: tagsError } =
    await supabase
      .from("meal_tags")
      .select("*");

  if (tagsError) {
    console.log(tagsError);
    return;
  }

  const { data: sidesData } =
  await supabase
    .from("meal_sides")
    .select("*");

const { data: saladsData } =
  await supabase
    .from("meal_salads")
    .select("*");

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
  loadMeals();
}, []);

const filteredMeals = meals.filter((meal) => {
  if (meal.type !== mealType) return false;

  return selectedTags.every((tag) =>
    meal.tags.includes(tag)
  );
});

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
      },
    ]);

  loadMeals();
}

if (currentPage === "addSide") {
  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "12px",
      }}
    >
      <button
        onClick={() =>
          setCurrentPage("addMeal")
        }
      >
        ← Atpakaļ
      </button>

      <h2>🍚 Piedevas</h2>

      {allSides.map((side) => (
  <div
    key={side}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      marginBottom: "8px",
      backgroundColor: "#f5f5f5",
      borderRadius: "12px",
    }}
  >
    <span>{side}</span>

    <button
      onClick={() =>
  setSelectedSideItem(side)
}
      style={{
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer",
      }}
    >
      ⋮
    </button>
  </div>
))}


      <button
        onClick={addNewSide}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "12px",
        }}
      >
        ➕ Jauna piedeva
      </button>
      {selectedSideItem && (
        <div
          onClick={() =>
            setSelectedSideItem(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            <h3>
              {selectedSideItem}
            </h3>

            <button
              onClick={() =>
                renameSide(
                  selectedSideItem
                )
              }
            >
              ✏️ Pārsaukt
            </button>

            <button
              onClick={() =>
                deleteSide(
                  selectedSideItem
                )
              }
            >
              🗑️ Dzēst
            </button>

            <button
              onClick={() =>
                setSelectedSideItem(null)
              }
            >
              Aizvērt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

if (currentPage === "addSalad") {
  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "12px",
      }}
    >
      <button
        onClick={() =>
          setCurrentPage("addMeal")
        }
      >
        ← Atpakaļ
      </button>

      <h2>🥗 Salāti</h2>

      {allSalads.map((salad) => (
  <div
    key={salad}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      marginBottom: "8px",
      backgroundColor: "#f5f5f5",
      borderRadius: "12px",
    }}
  >
    <span>{salad}</span>

    <button
      onClick={() =>
        setSelectedSaladItem(salad)
      }
      style={{
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer",
      }}
    >
      ⋮
    </button>
  </div>
))}

      <button
        onClick={addNewSalad}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "12px",
        }}
      >
        ➕ Jauni salāti
      </button>
      {selectedSaladItem && (
        <div
          onClick={() =>
            setSelectedSaladItem(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            <h3>
              {selectedSaladItem}
            </h3>

            <button
              onClick={() =>
                renameSalad(
                  selectedSaladItem
                )
              }
            >
              ✏️ Pārsaukt
            </button>

            <button
              onClick={() =>
                deleteSalad(
                  selectedSaladItem
                )
              }
            >
              🗑️ Dzēst
            </button>

            <button
              onClick={() =>
                setSelectedSaladItem(null)
              }
            >
              Aizvērt
            </button>
          </div>
        </div>
      )}
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
    <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "-40px",
    }}
    >
      <button
  onClick={() => setCurrentPage("home")}
  style={{
    width: "38px",
    height: "38px",
    borderRadius: "30%",
    color: "#000",
    backgroundColor: "#dddddd",
    fontSize: "22px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "none",
  }}
>
  🏠
</button>

      <h2
      style={{
        margin: 0,
        flex: "1",
        lineHeight: "38px",
        textAlign: "center",
      }}
      >
        Pievienot ēdienu
        </h2>
        <div style={{ width: "38px" }} />
        </div>

      <br /><br />

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

        setNewMealType(
          newMealType === card.value
            ? ""
            : card.value
        );
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
  ➕ Jauna piedeva
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
    color: "white",
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
                position: "absolute",
                right: "6px",
                border: "none",
                background:
                  "transparent",
                color: "#2E7D32",
                fontSize: "18px",
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
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  🗑️ Dzēst
</button>
    </div>
  </div>
)}

{newMealType && (
  <input
    placeholder="Ēdiena nosaukums"
    value={newMealName}
    onChange={(e) =>
      setNewMealName(e.target.value)
    }
    style={{
      width: "90%",
      fontSize: "16px",
      padding: "8px",
      borderRadius: "12px",
      border: "1px solid #ddd",
      margin: "0 auto 16px auto",
      display: "block",
      boxSizing: "border-box",
    }}
  />
)}

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
                  ? "2px solid #1B5E20"
                  : "2px solid #000",
              backgroundColor:
                newMealSelectedTags.includes(tag)
                  ? "#4CAF50"
                  : "#E0E0E0",
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
) && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "12px",
      marginBottom: "12px",
    }}
  >
    <hr
      style={{
        border: "none",
        borderTop: "3px solid #d0d0d0",
        width: "100%",
        margin: 0,
      }}
    />

    <hr
      style={{
        border: "none",
        borderTop: "3px solid #d0d0d0",
        width: "100%",
      }}
    />
  </div>
)}

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

{newMealType && (
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
    onClick={saveMeal}
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
    Saglabāt ēdienu
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
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  }}
>
  <button
    onClick={() => setCurrentPage("addMeal")}
    style={{
      width: "38px",
      height: "38px",
      borderRadius: "30%",
      color: "#000",
      backgroundColor: "#dddddd",
      fontSize: "30px",
      fontWeight: "400",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      lineHeight: "1",
    }}
  >
    ✚
  </button>

  <h1
    style={{
      margin: 0,
      flex: 1,
      textAlign: "center",
    }}
  >
    🍔 Ko ēdīsim?
  </h1>

  <div style={{ width: "42px" }} />
</div>

<div
  style={{
    backgroundColor: "#F5f5f5",
    padding: "16px",
    borderRadius: "16px",
    marginBottom: "16px",
    border: "1px solid #e0e0e0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  }}
>
  
  {mealTypes.map((type) => (
      <button
        key={type.value}
        onClick={() => {
          setMealType(type.value);
          setSelectedTags([]);
      }}
        style={{
          padding: "10px",
          fontSize: "16px",
          border:
            mealType === type.value
              ? "4px solid #0D4715"
              : "4px solid transparent",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor:
            mealType === type.value
              ? "#4CAF50"
              : "#E0E0E0",
          color:
            mealType === type.value
              ? "white"
              : "black",
          fontWeight: "bold",
        }}
      >
        {type.label}
      </button>
    )
  )}
</div>

{mealType &&
filterGroups[mealType]?.length > 0 && (
  <>
<div
style={{
  backgroundColor: "#f5f5f5",
  padding: "10px",
  borderRadius: "16px",
  marginBottom: "16px",
  border: "1px solid #E0E0E0",
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
            padding: "6px 12px",
            borderRadius: "20px",
            border: selectedTags.includes(tag)
  ? "3px solid #1B5E20"
  : "3px solid transparent",
            fontWeight: "bold",
            backgroundColor:
              selectedTags.includes(tag)
                ? "#4CAF50"
                : "#E0E0E0",
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

<div
  style={{
    display: "flex",
    flexDirection: "column",
  }}
>
  <hr
    style={{
      border: "none",
      borderTop: "3px solid #d0d0d0",
      width: "100%",
      margin: 0
    }}
  />
  <hr
    style={{
      border: "none",
      borderTop: "3px solid #d0d0d0",
      width: "100%",
    }}
  />
</div>
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
        : "2px solid #ddd",
        borderRadius: "10px",
        cursor: "pointer",
        backgroundColor: isInMealPlan(meal)
        ? "#FFF59D"
        : "#fafafa",
        color: "#222",
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

{Object.values(mealPlan).some(
  (meals) => meals.length > 0
) && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "16px",
      marginBottom: "16px",
    }}
  >
    <hr
      style={{
        border: "none",
        borderTop: "3px solid #d0d0d0",
        width: "100%",
        margin: 0,
      }}
    />
    <hr
      style={{
        border: "none",
        borderTop: "3px solid #d0d0d0",
        width: "100%",
      }}
    />
  </div>
)}
{Object.values(mealPlan).some(
  (meals) => meals.length > 0
) && (
  
<div
  style={{
    backgroundColor: "#F5F5F5",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #E0E0E0",
    marginTop: "-10px",
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
) && (

<div
  style={{
    backgroundColor: "#F5F5F5",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #E0E0E0",
    marginTop: "16px",
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