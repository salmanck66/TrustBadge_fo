import React, { useState, useEffect } from "react";
import { Page, Card, Checkbox, Button, Layout } from "@shopify/polaris";

// Assuming you have stored these images inside the 'public/badges' folder
const availableBadges = [
  { id: 1, name: "VISA", imageUrl: "/badges/icons8-visa-200" },
  { id: 2, name: "MASTERCARD", imageUrl: "/badges/icons8-mastercard-200.png" },
  { id: 3, name: "PAYPAL", imageUrl: "/badges/icons8-paypal-200.png" },
  { id: 4, name: "AMERICAN EXPRESS", imageUrl: "/badges/icons8-american-express-200.png" },
  { id: 5, name: "GOOGLE PAY", imageUrl: "/badges/icons8-google-pay-240.png" },
  { id: 6, name: "AMAZON PAY", imageUrl: "/badges/icons8-amazon-pay-200.png" },
];

const Badges = () => {
  const [selectedBadges, setSelectedBadges] = useState([]);

  // Load initially selected badges from the server (placeholder logic)
  useEffect(() => {
    // Fetch existing selected badges for the store (e.g., from a MongoDB API)
    fetch("/api/get-selected-badges")
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
    // Send selected badges to the server to store them in the DB
    fetch("/api/save-selected-badges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ badges: selectedBadges }),
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
        {availableBadges.map((badge) => (
          <Layout.Section oneThird key={badge.id}>
            <Card
              title={badge.name}
              sectioned
              actions={[
                {
                  content: "Preview",
                  onAction: () => window.open(badge.imageUrl, "_blank"),
                },
              ]}
            >
              <img
                src={badge.imageUrl}
                alt={badge.name}
                style={{ width: "200px", height: "200px", marginBottom: "10px" }}
              />
              <Checkbox
                label={badge.name}
                checked={selectedBadges.includes(badge.id)}
                onChange={() => handleBadgeChange(badge.id)}
              />
            </Card>
          </Layout.Section>
        ))}
      </Layout>
      <Button onClick={handleSave} primary>
        Save Selected Badges
      </Button>
    </Page>
  );
};

export default Badges;
