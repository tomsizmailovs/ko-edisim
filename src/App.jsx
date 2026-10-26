import { useState, useEffect } from "react";
import { meals } from "./meals";

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
  } else {
    setSelectedTags([...selectedTags, tag]);
  }
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
    display: "flex",
    gap: "8px",
  }}
>
  
  {["Brokastis", "Pusdienas", "Vakariņas", "Deserts"].map(
    (type) => (
      <button
        key={type}
        onClick={() => {
          setMealType(type);
          setSelectedTags([]);
      }}
        style={{
          flex: 1,
          padding: "12px",
          border:
            mealType === type
              ? "4px solid #0D4715"
              : "2px solid transparent",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor:
            mealType === type
              ? "#4CAF50"
              : "#E0E0E0",
          color:
            mealType === type
              ? "white"
              : "black",
          fontWeight: "bold",
        }}
      >
        {type}
      </button>
    )
  )}
</div>

<div
style={{
  backgroundColor: "#f5f5f5",
  padding: "16px",
  borderRadius: "16px",
  marginBottom: "16px",
  border: "1px solid #E0E0E0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
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

      <h3 style={{ marginTop: "20px" }}>Rezultāti</h3>

      {filteredMeals.length === 0 ? (
        <p>Nav atrastu ēdienu</p>
      ) : (
<div>
  {filteredMeals.map((meal) => (
<div
  key={meal.name}
  onClick={() => addToMealPlan(meal)}
  style={{
    padding: "12px",
    marginTop: "8px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    cursor: "pointer",
  }}
>
  {meal.name}
</div>
  ))}
</div>
      )}
      <h2 style={{ marginTop: "30px" }}>
  Mana ēdienkarte
</h2>

<h3>Brokastis</h3>

{mealPlan.Brokastis.map((meal) => (
  <div
    key={meal.name}
    onClick={() => removeFromMealPlan(
      "Brokastis",
      meal.name
    )}
    style={{
      padding: "12px",
      marginTop: "8px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#dff5df",
      cursor: "pointer",
    }}
  >
    {meal.name}
  </div>
))}

<h3>Pusdienas</h3>

{mealPlan.Pusdienas.map((meal) => (
  <div
    key={meal.name}
    onClick={() => removeFromMealPlan(
      "Pusdienas",
      meal.name
    )}
    style={{
      padding: "12px",
      marginTop: "8px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#dff5df",
      cursor: "pointer",
    }}
  >
    {meal.name}
  </div>
))}

<h3>Vakariņas</h3>

{mealPlan.Vakariņas.map((meal) => (
  <div
    key={meal.name}
    onClick={() => removeFromMealPlan(
      "Vakariņas",
      meal.name
    )}
    style={{
      padding: "12px",
      marginTop: "8px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#dff5df",
      cursor: "pointer",
    }}
  >
    {meal.name}
  </div>
))}

<h3>Deserts</h3>

{(mealPlan.Deserts || []).map((meal) => (
  <div
    key={meal.name}
    onClick={() => removeFromMealPlan(
      "Deserts",
      meal.name
    )}
    style={{
      padding: "12px",
      marginTop: "8px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#dff5df",
      cursor: "pointer",
    }}
  >
    {meal.name}
  </div>
))}
    </div>
  );
}