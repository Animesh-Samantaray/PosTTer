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
import RecentComentsList from "../../components/Cards/RecentComentsList";

const cardClass =
  "bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [maxViews, setMaxViews] = useState(1);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DASHBOARD_DATA
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
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    
    {/* Spinner */}
    <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>

    {/* Text */}
    <div className="text-sm font-medium text-gray-600 tracking-wide animate-pulse">
      Loading dashboard...
    </div>

  </div>
      )}

      {/* Content */}
      {!loading && dashboardData && (
        <div className="space-y-6 md:space-y-8 mt-[20px]">
          {/* Header + Summary */}
          <div className={cardClass}>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Good day! {user?.name || "Admin"}
              </h2>

              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {moment().format("dddd, MMM YYYY")}
              </p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
              <DashboardSummaryCard
                icon={<LuGalleryVerticalEnd />}
                label="Total Posts"
                value={dashboardData?.stats?.totalPosts || 0}
                bgColor="bg-sky-100"
                color="text-sky-600"
              />

              <DashboardSummaryCard
                icon={<LuCheckCheck />}
                label="Published"
                value={dashboardData?.stats?.published || 0}
                bgColor="bg-emerald-100"
                color="text-emerald-600"
              />

              <DashboardSummaryCard
                icon={<LuChartLine />}
                label="Views"
                value={dashboardData?.stats?.totalViews || 0}
                bgColor="bg-indigo-100"
                color="text-indigo-600"
              />

              <DashboardSummaryCard
                icon={<LuHeart />}
                label="Likes"
                value={dashboardData?.stats?.totalLikes || 0}
                bgColor="bg-rose-100"
                color="text-rose-600"
              />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Top Insights */}
            <div className={`xl:col-span-7 ${cardClass}`}>
              <h5 className="font-semibold text-gray-800 mb-4 text-center xl:text-left">
                Top Insights
              </h5>

              <TagInsights tagUsage={dashboardData?.tagUsage || []} />
            </div>

            {/* Top Posts */}
            <div className={`xl:col-span-5 ${cardClass}`}>
              <h5 className="font-semibold text-gray-800 mb-4 text-center xl:text-left">
                Top Posts
              </h5>

              <div className="space-y-4">
                {dashboardData?.topPosts?.slice(0, 3)?.map((post) => (
                <div key={post._id}>
                   <TopPostCard
                    title={post.title}
                     postId={post._id} 
                    coverImageUrl={post.coverImageUrl}
                    views={post.views}
                    likes={post.likes}
                    maxViews={maxViews}
                  />
                </div>
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className={`xl:col-span-12 ${cardClass}`}>
              <h5 className="font-semibold text-gray-800 mb-4 text-center xl:text-left">
                Recent Comments
              </h5>

              <RecentComentsList
                comments={dashboardData?.recentComments || []}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
