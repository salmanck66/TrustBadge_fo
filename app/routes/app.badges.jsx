import React, { useState, useEffect } from "react";
import { Page, Card, Button, Layout } from "@shopify/polaris";

// Assuming you have stored these images inside the 'public/badges' folder
const availableBadges = [
  { id: 1, name: "VISA", imageUrl: "/badges/icons8-visa-200.png" },
  { id: 2, name: "MASTERCARD", imageUrl: "/badges/icons8-mastercard-200.png" },
  { id: 3, name: "PAYPAL", imageUrl: "/badges/icons8-paypal-200.png" },
  { id: 4, name: "AMERICAN EXPRESS", imageUrl: "/badges/icons8-american-express-200.png" },
  { id: 5, name: "GOOGLE PAY", imageUrl: "/badges/icons8-google-pay-240.png" },
  { id: 6, name: "AMAZON PAY", imageUrl: "/badges/icons8-amazon-pay-200.png" },
];

const Badges = () => {
  const [selectedBadges, setSelectedBadges] = useState([]);

  useEffect(() => {
    fetch("/api/get-selected-badges?storeId=example-store-id") // Replace with actual store ID
      .then((res) => res.json())
      .then((data) => {
        if (data.selectedBadges) {
          setSelectedBadges(data.selectedBadges);
        }
      });
  }, []);
  

  const handleBadgeChange = (id) => {
    setSelectedBadges((prevSelectedBadges) => {
      if (prevSelectedBadges.includes(id)) {
        return prevSelectedBadges.filter((badgeId) => badgeId !== id);
      } else {
        return [...prevSelectedBadges, id];
      }
    });
  };

  const handleSave = () => {
    fetch("/api/save-selected-badges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storeId: "example-store-id", badges: selectedBadges }), // Replace with actual store ID
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Badges saved successfully!");
        }
      });
  };
  

  return (
    <Page title="Select Trust Badges">
      <Layout>
        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // 3 badges in a row
              gap: "20px",
              justifyItems: "center",
            }}
          >
            {availableBadges.map((badge) => (
              <Card sectioned key={badge.id}>
                <div
                  onClick={() => handleBadgeChange(badge.id)}
                  style={{
                    backgroundColor: selectedBadges.includes(badge.id)
                      ? "#333" // dark gray for selected
                      : "#fff", // white for unselected
                    cursor: "pointer",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "120px", // reduced size
                    height: "120px", // reduced size
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    style={{ width: "100px", height: "100px", objectFit: "contain" }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </Layout.Section>

        <Layout.Section>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              onClick={handleSave}
              primary
              size="large" // larger button
              style={{ marginBottom: "30px" }} // margin below the button
            >
              Save Selected Badges
            </Button>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Badges;
