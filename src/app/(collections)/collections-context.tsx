"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PostData } from "@/schemas/post";

interface CollectionsContextType {
  currentCollections: Partial<PostData>[];
  totalCollections: number;
  setCurrentCollections: (collections: Partial<PostData>[]) => void;
  setTotalCollections: (total: number) => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(
  undefined
);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [currentCollections, setCurrentCollections] = useState<
    Partial<PostData>[]
  >([]);
  const [totalCollections, setTotalCollections] = useState<number>(0);

  return (
    <CollectionsContext.Provider
      value={{
        currentCollections,
        totalCollections,
        setCurrentCollections,
        setTotalCollections,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
}
