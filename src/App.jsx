import { useState, useEffect } from "react";

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

const filterGroups = {
  Brokastis: [
    ["Salds", "Sāļš"],
    ["Silts", "Auksts"],
    ["Olas", "Maize"],
    ["Pankūkas"],
    ["Olbaltumvielas", "Šķiedrvielas"],
    ["15 min"],
  ],

  Pusdienas: [
    ["Salds", "Sāļš"],
    ["Silts", "Auksts"],
    ["Zupa"],
    ["Olbaltumvielas", "Šķiedrvielas"],
    ["15 min"],
  ],

  Vakariņas: [
    ["Silts", "Auksts"],
    ["Vista", "Cūka"],
    ["Liellops", "Zivs"],
    ["Olbaltumvielas", "Šķiedrvielas"],
  ],

  Deserts: [
    ["Silts", "Auksts"],
    ["Ātri pagatavojams"],
  ],
};

export default function App() {
  const [mealType, setMealType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [meals,setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedSide, setSelectedSide] = useState("");
  const [selectedSalad, setSelectedSalad] = useState("");
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
const [newMealName, setNewMealName] =
  useState("");

const [newMealType, setNewMealType] =
  useState("Brokastis");

const [newMealTags, setNewMealTags] =
  useState("");

const [newMealImage, setNewMealImage] =
  useState("");

const [newMealSides, setNewMealSides] =
  useState("");

const [newMealSalads, setNewMealSalads] =
  useState("");
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

  setSelectedTags([...newTags, tag]);
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

function needsPopup(meal) {
  const hasSides =
    meal.sides?.some(
      (side) => side.trim() !== ""
    );

  const hasSalads =
    meal.salads?.some(
      (salad) => salad.trim() !== ""
    );

  return hasSides || hasSalads;
}

useEffect(() => {
  fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGv8FtD1nezrhxjiJQZr5ivEHTOR7QVLuwId1KRIQ5ouM_Xz1P69Xk2PGfSYUWjk34pJ9aC6UZvVa0/pub?output=csv"
  )
    .then((response) => response.text())
    .then((csv) => {
      const rows = csv.trim().split("\n");

      const data = rows.slice(1).map((row) => {
        const [name, type, tags, bilde, piedevas, salāti] = row.split(",");
        return {
          name,
          type,
          tags: tags
            ? tags.split(";").map((tag) => tag.trim())
            : [],
          image: bilde?.trim(),

          sides: piedevas
          ? piedevas.split(";")
          .map(item => item.trim())
          .filter(item => item !== "")
          : [],

          salads: salāti
          ? salāti.split(";")
          .map(item => item.trim())
          .filter(item => item !== "")
          : [],
        };
      });

      setMeals(data);
    });
}, []);

const filteredMeals = meals.filter((meal) => {
  if (meal.type !== mealType) return false;

  return selectedTags.every((tag) =>
    meal.tags.includes(tag)
  );
});

if (currentPage === "addMeal") {
  return (
    <div
      style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "12px",
      }}
    >
      <button
        onClick={() => setCurrentPage("home")}
      >
        ← Atpakaļ
      </button>

      <h2>Pievienot ēdienu</h2>

      <input
        placeholder="Nosaukums"
        value={newMealName}
        onChange={(e) =>
          setNewMealName(e.target.value)
        }
      />

      <br /><br />

      <select
        value={newMealType}
        onChange={(e) =>
          setNewMealType(e.target.value)
        }
      >
        <option>Brokastis</option>
        <option>Pusdienas</option>
        <option>Vakariņas</option>
        <option>Deserts</option>
      </select>

      <br /><br />

      <input
        placeholder="Filtri"
        value={newMealTags}
        onChange={(e) =>
          setNewMealTags(e.target.value)
        }
      />

      <br /><br />

      <input
        placeholder="Bilde"
        value={newMealImage}
        onChange={(e) =>
          setNewMealImage(e.target.value)
        }
      />
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
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "#048bfa",
      color: "white",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    ➕
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
          padding: "12px",
          fontSize: "16px",
          border:
            mealType === type.value
              ? "4px solid #0D4715"
              : "2px solid transparent",
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

{mealType && (
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
  {filterGroups[mealType].map((group, index) => (
<div
  key={index}
  style={{
    display: "grid",
    gridTemplateColumns:
      group.length === 2
        ? "repeat(2, 1fr)"
        : "1fr",
    gap: "8px",
    width: "100%",
  }}
>
      {group.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          style={{
            padding: "8px 12px",
            maxWidth: "100%",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
            backgroundColor: selectedTags.includes(tag)
              ? "#4CAF50"
              : "#E0E0E0",
            color: selectedTags.includes(tag)
              ? "white"
              : "black",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  ))}
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
    meal.sides?.length > 0 ||
    meal.salads?.length > 0
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
        : "1px solid #ddd",
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

{selectedMeal.sides?.length > 0 && (
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
  {selectedMeal.sides.map((side) => (
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
    : "1px solid #ddd",
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

{selectedMeal.salads?.length > 0 && (
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
  {selectedMeal.salads.map((salad) => (
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
    : "1px solid #ddd",
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
    marginTop: "24px",
  }}
>

<h3
      style={{
        textAlign: "center",
        marginTop: "0",
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
  </div>
  );
}