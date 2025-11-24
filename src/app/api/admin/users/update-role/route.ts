import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

/**
 * Verify that the requester is an admin
 */
async function verifyAdmin(requesterId: string): Promise<boolean> {
  try {
    if (!requesterId) return false;
    
    const userDoc = await adminDb.collection("users").doc(requesterId).get();
    if (!userDoc.exists) return false;

    const userData = userDoc.data();
    return userData?.role === "admin" || !!userData?.isSuperAdmin;
  } catch (error) {
    console.error("[verifyAdmin] Error verifying admin:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, role, requesterId } = body;

    // Verify admin access
    if (!requesterId || !(await verifyAdmin(requesterId))) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing userId or role" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["customer", "provider", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'customer', 'provider', or 'admin'" },
        { status: 400 }
      );
    }

    // Prevent removing the last admin
    if (role !== "admin") {
      const currentUserDoc = await adminDb.collection("users").doc(userId).get();
      const currentRole = currentUserDoc.data()?.role;
      
      if (currentRole === "admin") {
        // Check if this is the last admin
        const allAdmins = await adminDb
          .collection("users")
          .where("role", "==", "admin")
          .get();
        
        if (allAdmins.size <= 1) {
          return NextResponse.json(
            { error: "Cannot remove the last admin. At least one admin must exist." },
            { status: 400 }
          );
        }
      }
    }

    // Prevent self-demotion from admin
    if (userId === requesterId && role !== "admin") {
      const currentUserDoc = await adminDb.collection("users").doc(userId).get();
      const currentRole = currentUserDoc.data()?.role;
      if (currentRole === "admin") {
        return NextResponse.json(
          { error: "You cannot remove your own admin role." },
          { status: 400 }
        );
      }
    }

    // Update the user's role
    await adminDb.collection("users").doc(userId).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (err) {
    console.error("[API /api/admin/users/update-role] Failed to update role", err);
    const message = err instanceof Error ? err.message : "Failed to update user role";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
