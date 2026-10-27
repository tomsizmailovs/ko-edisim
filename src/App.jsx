import { useState, useEffect } from "react";
import { meals } from "./meals";

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
    ["Olbaltumvielas", "Šķiedrvielas"],
    ["15 min"],
    ["Pagatavojams vairākām dienām"],
  ],

  Pusdienas: [
    ["Salds", "Sāļš"],
    ["Silts", "Auksts"],
    ["Olbaltumvielas", "Šķiedrvielas"],
    ["15 min"],
    ["Pagatavojams vairākām dienām"],
  ],

  Vakariņas: [
    ["Silts", "Auksts"],
    ["Olbaltumvielas", "Šķiedrvielas"],
    ["15 min"],
    ["Pagatavojams vairākām dienām"],
  ],

  Deserts: [
    ["Silts", "Auksts"],
    ["Ātri pagatavojams"],
  ],
};

export default function App() {
  const [mealType, setMealType] = useState("Brokastis");
  const [selectedTags, setSelectedTags] = useState([]);
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

useEffect(() => {
  localStorage.setItem(
    "mealPlan",
    JSON.stringify(mealPlan)
  );
}, [mealPlan]);

const filteredMeals = meals.filter((meal) => {
  if (meal.type !== mealType) return false;

  return selectedTags.every((tag) =>
    meal.tags.includes(tag)
  );
});

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
      <h1>🍔 Ko ēdīsim?</h1>

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
      onClick={() => addToMealPlan(meal)}
      style={{
        
        padding: "12px",
        marginTop: "8px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        cursor: "pointer",
        backgroundColor: "#fafafa",
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
          marginBottom: "8px",
        }}
        />
      )}
<strong>{meal.name}</strong>
      </div>
  ))}
</div>
      )}
<div
  style={{
    backgroundColor: "#F5F5F5",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #E0E0E0",
    marginTop: "24px",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${
        Object.entries(mealPlan).filter(
          ([, meals]) => meals.length > 0
        ).length || 1
      }, 1fr)`,
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
              marginBottom: "12px",
            }}
          >
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
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "10px",
                backgroundColor: "#DFF5DF",
                cursor: "pointer",
              }}
            >
              {meal.name}
            </div>
          ))}
        </div>
      ))}
  </div>
</div>
    </div>
  );
}