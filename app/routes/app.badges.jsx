import React, { useState, useEffect } from "react";
import { Page, Card, Button, Layout, Spinner } from "@shopify/polaris";

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
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [isSaving, setIsSaving] = useState(false); // For handling save button state
  const [storeId, setStoreId] = useState("theh2o2"); // Default storeId
  
  useEffect(() => {
    setIsLoading(true);
    fetch('https://truestbadgebackend.vercel.app/api/get-selected-badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId: 'theh2o2' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.selectedBadges) {
          setSelectedBadges(data.selectedBadges);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching badges:', error);
        setIsLoading(false);
      });
  }, []);

  const handleBadgeChange = (id) => {
    if (!isLoading && !isSaving) {
      setSelectedBadges((prevSelectedBadges) => {
        if (prevSelectedBadges.includes(id)) {
          return prevSelectedBadges.filter((badgeId) => badgeId !== id);
        } else {
          return [...prevSelectedBadges, id];
        }
      });
    }
  };

  const handleSave = () => {
    if (!storeId) {
      alert("No storeId found");
      return;
    }

    setIsSaving(true); // Show saving state while saving
    fetch("https://truestbadgebackend.vercel.app/api/save-selected-badges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storeId, badges: selectedBadges }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSaving(false);
        if (data.success) {
          alert("Badges saved successfully!");
        } else {
          alert("Failed to save badges");
        }
      })
      .catch((error) => {
        setIsSaving(false);
        console.error("Error saving badges:", error);
        alert("Error saving badges");
      });
  };

  return (
    <Page title="Select Trust Badges">
      <Layout>
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <Spinner accessibilityLabel="Loading badges" size="large" />
          </div>
        ) : (
          <>
            <Layout.Section>
              <p>{storeId ? `Hello, store ID: ${storeId}` : "No store ID found"}</p>
            </Layout.Section>

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
                          ? "#333"
                          : "#fff",
                        cursor: "pointer",
                        padding: "10px",
                        borderRadius: "8px",
                        width: "120px",
                        height: "120px",
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
                  size="large"
                  style={{ marginBottom: "30px" }}
                  loading={isSaving}
                  disabled={isSaving || isLoading}
                >
                  Save Selected Badges
                </Button>
              </div>
            </Layout.Section>
          </>
        )}
      </Layout>
    </Page>
  );
};

export default Badges;
