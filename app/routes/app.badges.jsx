import React, { useState, useEffect, useCallback } from "react";
import { Page, Card, Button, Layout, Spinner, Toast, Frame } from "@shopify/polaris";

// Memoized available badges
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
  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [storeId, setStoreId] = useState("theh2o2");
  const [toastContent, setToastContent] = useState(null); 

  const showToast = useCallback((content) => {
    setToastContent(content);
  }, []);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch('https://truestbadgebackend.vercel.app/api/get-selected-badges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storeId: 'theh2o2' }),
        });

        const data = await res.json();
        if (data.selectedBadges) {
          setSelectedBadges(data.selectedBadges);
        }
      } catch (error) {
        showToast("Error fetching badges");
        console.error("Error fetching badges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, [showToast]);

  const handleBadgeChange = useCallback((id) => {
    if (!isLoading && !isSaving) {
      setSelectedBadges((prevSelectedBadges) => {
        if (prevSelectedBadges.includes(id)) {
          return prevSelectedBadges.filter((badgeId) => badgeId !== id);
        } else {
          return [...prevSelectedBadges, id];
        }
      });
    }
  }, [isLoading, isSaving]);

  const handleSave = async () => {
    if (!storeId) {
      showToast("No storeId found");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("https://truestbadgebackend.vercel.app/api/save-selected-badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, badges: selectedBadges }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Badges saved successfully!");
      } else {
        showToast("Failed to save badges");
      }
    } catch (error) {
      console.error("Error saving badges:", error);
      showToast("Error saving badges");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Frame>
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
                    gridTemplateColumns: "repeat(3, 1fr)",
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

        {toastContent && <Toast content={toastContent} onDismiss={() => setToastContent(null)} />}
      </Page>
    </Frame>
  );
};

export default Badges;
