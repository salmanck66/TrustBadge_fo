import React, { useState, useEffect } from "react";
import { Page, Card, Checkbox, Button, Layout } from "@shopify/polaris";

// Assuming you have a list of available badges
const availableBadges = [
  { id: 1, name: "VISA", imageUrl: "/path-to-visa-image" },
  { id: 2, name: "MASTERCARD", imageUrl: "/path-to-mastercard-image" },
  { id: 3, name: "PAYPAL", imageUrl: "/path-to-paypal-image" },
  { id: 4, name: "AMERICAN EXPRESS", imageUrl: "/path-to-american-express-image" },
  { id: 5, name: "GOOGLE PAY", imageUrl: "/path-to-google-pay-image" },
  { id: 6, name: "AMAZON PAY", imageUrl: "/path-to-amazon-pay-image" },
];

const Badges = () => {
  const [selectedBadges, setSelectedBadges] = useState([]);

  // Load initially selected badges from the server (placeholder logic)
  useEffect(() => {
    // Fetch existing selected badges for the store (e.g., from a MongoDB API)
    // This is a placeholder for actual fetching logic.
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
          // Success feedback (could use Shopify Toast or similar)
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
