import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [stats, setStats] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult(data);
        toast({
          title: "Upload successful!",
          description: `Inserted: ${data.summary.inserted} | Updated: ${data.summary.updated} | Errors: ${data.summary.errors}`,
        });
        
        // Refresh stats
        fetchStats();
      } else {
        toast({
          title: "Upload failed",
          description: data.message || "An error occurred during upload",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/upload-stats`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Upload</h1>
          <p className="text-gray-600">
            Upload a CSV file to bulk import or update products in your store.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Select a CSV file with product data. The file should have columns: Title, Description, Price, ImageURL, SKU
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleUpload} 
                  disabled={!file || uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Products
                    </>
                  )}
                </Button>

                {/* Upload Result */}
                {uploadResult && (
                  <Alert className={uploadResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <div className="flex items-start gap-3">
                      {uploadResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <AlertDescription className="font-medium">
                          {uploadResult.message}
                        </AlertDescription>
                        {uploadResult.summary && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Inserted: {uploadResult.summary.inserted}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Updated: {uploadResult.summary.updated}
                            </Badge>
                            {uploadResult.summary.errors > 0 && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                Errors: {uploadResult.summary.errors}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* CSV Format Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  CSV Format Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    Your CSV file must include the following columns:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong className="text-gray-900">Required Columns:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>• Title (Product name)</li>
                        <li>• Description (Product description)</li>
                        <li>• Price (Numeric value)</li>
                        <li>• ImageURL (Image URL)</li>
                        <li>• SKU (Unique identifier)</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-gray-900">Optional Columns:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>• Category (Product category)</li>
                        <li>• Stock (Available quantity)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-xs">
                      <strong>Note:</strong> Products with existing SKUs will be updated, new SKUs will be inserted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Store Statistics</CardTitle>
                <CardDescription>Current product information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Products</span>
                      <Badge variant="secondary">{stats.totalProducts}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Products</span>
                      <Badge variant="secondary">{stats.activeProducts}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Categories</span>
                      <Badge variant="secondary">{stats.categories}</Badge>
                    </div>
                    {stats.categoryList && stats.categoryList.length > 0 && (
                      <div className="pt-2 border-t">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Categories:</span>
                        <div className="flex flex-wrap gap-1">
                          {stats.categoryList.slice(0, 5).map((category, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          {stats.categoryList.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{stats.categoryList.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
                    Loading stats...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sample CSV Download */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sample CSV</CardTitle>
                <CardDescription>Download a sample CSV file to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const sampleData = `Title,Description,Price,ImageURL,SKU,Category,Stock
Wireless Headphones,High-quality wireless headphones with noise cancellation,1299,https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop,WH001,electronics,50
Cotton T-Shirt,Comfortable cotton t-shirt for everyday wear,599,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop,TS001,clothing,100
Smartphone Case,Protective case for your smartphone,299,https://images.unsplash.com/photo-1603313011108-4f2d0b3b0b0b?w=300&h=300&fit=crop,SC001,electronics,75
Running Shoes,Comfortable running shoes for athletes,2499,https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop,RS001,sports,30
Kitchen Mixer,Professional kitchen mixer for baking,3999,https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop,KM001,home,20`;
                    
                    const blob = new Blob([sampleData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sample-products.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  Download Sample CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
