"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminDonutChart } from "@/features/admin-dashboard/components/AdminDonutChart";
import {
  AdminDashboardErrorState,
  AdminDashboardLoadingState,
} from "@/features/admin-dashboard/components/AdminDashboardStates";
import { AdminMetricCard } from "@/features/admin-dashboard/components/AdminMetricCard";
import { AdminRecentUsersTable } from "@/features/admin-dashboard/components/AdminRecentUsersTable";
import { AdminReportStatusGrid } from "@/features/admin-dashboard/components/AdminReportStatusGrid";
import type {
  AdminAccountMetric,
  AdminRecentUser,
  AdminReportMetric,
} from "@/features/admin-dashboard/types/adminDashboard.types";
import { adminUserService } from "@/features/admin-users/services/adminUserService";
import type {
  AdminUser,
  AdminUserRole,
} from "@/features/admin-users/types/adminUser.types";
import { commanderDashboardService } from "@/features/commander-dashboard/services/commanderDashboardService";
import type { CommanderDashboardOverview } from "@/features/commander-dashboard/types/commanderDashboard.types";

type DashboardState = "loading" | "normal" | "error";

const emptyOverview: CommanderDashboardOverview = {
  totalReports: 0,
  newReports: 0,
  underVerificationReports: 0,
  transferredReports: 0,
  resolvedReports: 0,
  spamReports: 0,
  criticalReports: 0,
  highReports: 0,
  mediumReports: 0,
  lowReports: 0,
};

const rolePriority: AdminUserRole[] = [
  "ADMIN",
  "COMMANDER",
  "DISPATCHER",
  "OFFICER",
];

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function getPrimaryRole(user: AdminUser): AdminRecentUser["role"] {
  return rolePriority.find((role) => user.roles.includes(role)) ?? "OFFICER";
}

function buildAccountMetrics(users: AdminUser[]): AdminAccountMetric[] {
  const countRole = (role: AdminUserRole) =>
    users.filter((user) => user.roles.includes(role)).length;

  return [
    {
      id: "total",
      label: "Tổng tài khoản",
      value: formatCount(users.length),
      tone: "default",
    },
    {
      id: "active",
      label: "Đang hoạt động",
      value: formatCount(users.filter((user) => user.status === "ACTIVE").length),
      tone: "success",
    },
    {
      id: "locked",
      label: "Bị khóa",
      value: formatCount(users.filter((user) => user.status === "LOCKED").length),
      tone: "danger",
    },
    {
      id: "officer",
      label: "Cán bộ",
      value: formatCount(countRole("OFFICER")),
      tone: "officer",
    },
    {
      id: "dispatcher",
      label: "Điều phối",
      value: formatCount(countRole("DISPATCHER")),
      tone: "dispatcher",
    },
    {
      id: "commander",
      label: "Chỉ huy",
      value: formatCount(countRole("COMMANDER")),
      tone: "commander",
    },
    {
      id: "admin",
      label: "Quản trị viên",
      value: formatCount(countRole("ADMIN")),
      tone: "admin",
    },
  ];
}

function buildReportMetrics(
  overview: CommanderDashboardOverview,
): AdminReportMetric[] {
  const processingReports =
    overview.underVerificationReports + overview.transferredReports;

  return [
    {
      id: "total",
      label: "Tổng tin báo",
      value: formatCount(overview.totalReports),
      tone: "primary",
    },
    {
      id: "new",
      label: "Mới tiếp nhận",
      value: formatCount(overview.newReports),
      tone: "default",
    },
    {
      id: "processing",
      label: "Đang xử lý",
      value: formatCount(processingReports),
      tone: "default",
    },
    {
      id: "resolved",
      label: "Đã xử lý",
      value: formatCount(overview.resolvedReports),
      tone: "success",
    },
    {
      id: "urgent",
      label: "Khẩn cấp",
      value: formatCount(overview.criticalReports + overview.highReports),
      tone: "danger",
    },
    {
      id: "spam",
      label: "Giả / Spam",
      value: formatCount(overview.spamReports),
      tone: "default",
    },
  ];
}

async function getDashboardData() {
  const [userList, reportOverview] = await Promise.all([
    adminUserService.getAll(),
    commanderDashboardService.getOverview(),
  ]);

  return { userList, reportOverview };
}

export function AdminDashboardContent() {
  const [dashboardState, setDashboardState] =
    useState<DashboardState>("loading");
  const [showToast, setShowToast] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [overview, setOverview] =
    useState<CommanderDashboardOverview>(emptyOverview);

  const fetchDashboard = useCallback(
    async (showSuccessToast = false) => {
      try {
        const { userList, reportOverview } = await getDashboardData();

        setUsers(userList);
        setOverview(reportOverview);
        setDashboardState("normal");

        if (showSuccessToast) {
          setShowToast(true);
          window.setTimeout(() => setShowToast(false), 2200);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
        setDashboardState("error");
      }
    },
    [],
  );

  const loadDashboard = useCallback(
    async (showSuccessToast = false) => {
      setDashboardState("loading");
      await fetchDashboard(showSuccessToast);
    },
    [fetchDashboard],
  );

  useEffect(() => {
    let isMounted = true;

    getDashboardData()
      .then(({ userList, reportOverview }) => {
        if (!isMounted) return;
        setUsers(userList);
        setOverview(reportOverview);
        setDashboardState("normal");
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Failed to load admin dashboard", error);
        setDashboardState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const accountMetrics = useMemo(() => buildAccountMetrics(users), [users]);
  const reportMetrics = useMemo(() => buildReportMetrics(overview), [overview]);
  const recentUsers = useMemo<AdminRecentUser[]>(
    () =>
      users.slice(0, 5).map((user) => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: getPrimaryRole(user),
        status: user.status,
        createdAt: user.createdAt,
      })),
    [users],
  );
  const processingReports =
    overview.underVerificationReports + overview.transferredReports;

  return (
    <div className="relative px-8 py-8">
      {showToast ? (
        <div className="fixed bottom-8 right-8 z-50 flex items-start gap-3 rounded-xl bg-white px-6 py-4 shadow-2xl ring-1 ring-slate-200">
          <span className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            OK
          </span>

          <div>
            <p className="font-black text-slate-950">
              Cập nhật dữ liệu thành công
            </p>
            <p className="text-sm text-slate-500">
              Hệ thống đã đồng bộ dữ liệu mới nhất.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-4 text-slate-400 hover:text-slate-700"
          >
            x
          </button>
        </div>
      ) : null}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-950">
            Tổng quan quản trị
          </h1>

          <p className="mt-3 text-slate-600">
            Theo dõi tài khoản người dùng, danh mục nghiệp vụ và tình hình tin
            báo trên hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard(true)}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Làm mới dữ liệu
        </button>
      </section>

      <div className="mt-8">
        {dashboardState === "loading" ? <AdminDashboardLoadingState /> : null}

        {dashboardState === "error" ? (
          <AdminDashboardErrorState onRetry={() => void loadDashboard(true)} />
        ) : null}

        {dashboardState === "normal" ? (
          <>
            <section>
              <h2 className="text-2xl font-black text-slate-950">
                Thống kê tài khoản
              </h2>

              <div className="mt-3 h-px bg-slate-200" />

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
                {accountMetrics.map((metric) => (
                  <AdminMetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            </section>

            <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_24rem]">
              <AdminReportStatusGrid metrics={reportMetrics} />
              <AdminDonutChart
                total={overview.totalReports}
                newCount={overview.newReports}
                urgentCount={overview.criticalReports + overview.highReports}
                processingCount={processingReports}
              />
            </section>

            <section className="mt-12">
              <AdminRecentUsersTable users={recentUsers} />
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
