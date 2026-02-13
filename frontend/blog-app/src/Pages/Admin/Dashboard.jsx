import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";

import {
  LuChartLine,
  LuCheckCheck,
  LuGalleryVerticalEnd,
  LuHeart,
} from "react-icons/lu";

import DashboardSummaryCard from "../../components/Cards/DashboardSummaryCard";
import TagInsights from "../../components/Cards/TagInsights";
import TopPostCard from "../../components/Cards/TopPostCard";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [maxViews, setMaxViews] = useState(1);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DASHBOARD_DATA,
      );

      if (!data) return;

      setDashboardData(data);

      const topPosts = data?.topPosts || [];

      const totalViews = Math.max(...topPosts.map((p) => p.views || 0), 1);

      setMaxViews(totalViews);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Loading */}
      {loading && (
        <div className="mt-6 text-sm text-gray-500">Loading dashboard…</div>
      )}

      {/* Content */}
      {!loading && dashboardData && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5">
            {/* Header */}
            <div>
              <h2 className="text-xl md:text-2xl font-medium">
                Good day! {user?.name || "Admin"}
              </h2>

              <p className="text-xs md:text-[13px] font-medium text-gray-400 mt-1.5">
                {moment().format("dddd, MMM YYYY")}
              </p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
              <DashboardSummaryCard
                icon={<LuGalleryVerticalEnd />}
                label="Total Posts"
                value={dashboardData?.stats?.totalPosts || 0}
                bgColor="bg-sky-100/60"
                color="text-sky-600"
              />

              <DashboardSummaryCard
                icon={<LuCheckCheck />}
                label="Published"
                value={dashboardData?.stats?.published || 0}
                bgColor="bg-emerald-100/60"
                color="text-emerald-600"
              />

              <DashboardSummaryCard
                icon={<LuChartLine />}
                label="Views"
                value={dashboardData?.stats?.totalViews || 0}
                bgColor="bg-indigo-100/60"
                color="text-indigo-600"
              />

              <DashboardSummaryCard
                icon={<LuHeart />}
                label="Likes"
                value={dashboardData?.stats?.totalLikes || 0}
                bgColor="bg-rose-100/60"
                color="text-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-8">

  {/* Top Insights */}
  <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
    <div className="flex items-center justify-center">
      <h5 className="font-medium">Top Insights</h5>
    </div>

    <TagInsights tagUsage={dashboardData?.tagUsage || []}/>
  </div>

  {/* Top Posts */}
  <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
    <div className="flex items-center justify-center">
      <h5 className="font-medium">Top Posts</h5>
    </div>
{
  dashboardData?.topPosts?.slice(0,3)?.map((post) => (
    <TopPostCard
      key={post._id}
      title={post.title}
      coverImageUrl={post.coverImageUrl}
      views={post.views}
      likes={post.likes}
      maxViews={maxViews}
    />
  ))
}

  </div>

  {/* Recent Comments */}
  <div className="col-span-12 md:col-span-12 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
    <div className="flex items-center justify-center">
      <h5 className="font-medium">Recent Comments</h5>
    </div>
  </div>

</div>

        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
