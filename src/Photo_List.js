import React, {useCallback, useRef, useMemo, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  PermissionsAndroid,
  Dimensions,
  Image,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ModalPhotoBottomSheet from './components/ModalBottomSheet/ModalPhotoBottomSheet';
import BottomPhotoFlatList from './components/Bottom/BottomPhotoFlatList';
const PHOTO_COUTN = 5000;
const Photo_List = () => {
  const [image, setImage] = useState([]);
  const [group_name, setGroup_name] = useState([
    {title: '전체', count: PHOTO_COUTN},
  ]);
  const [pick_group, setPick_group] = useState('');
  const [pick_count, setPick_count] = useState(0);
  const [choise_imasge, setChoise_imasge] = useState([]);
  const [final_image, setFinal_image] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const hasAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    } catch (error) {
      console.log(error);
    }
  };
  const _handleAlbumArray = async () => {
    if (Platform.OS === 'android') {
      hasAndroidPermission().then(res => {
        if (res === true) {
          CameraRoll.getAlbums({
            first: PHOTO_COUTN,
            assetType: 'Photos',
            groupTypes: 'All',
            groupName: pick_group,
          })
            .then(async r => {
              console.log(r);
              await setPick_count(r[0].count);
              await setGroup_name(data => [...data, ...r]);
              await setTimeout(() => {
                setPick_group('전체');
              }, 500);
            })
            .catch(err => {
              //Error Loading Images
            });
        }
      });
    } else {
      CameraRoll.getAlbums({
        first: PHOTO_COUTN,
        assetType: 'Photos',
        groupTypes: 'All',
        groupName: pick_group,
      })
        .then(async r => {
          console.log(r);
          await setGroup_name(data => [...data, ...r]);
          // await setPick_count(r[0].count);
          await setPick_count(PHOTO_COUTN);
          await setTimeout(() => {
            // setPick_group(r[0].title);
            setPick_group('전체');
          }, 500);
        })
        .catch(err => {
          //Error Loading Images
        });
    }
  };
  const _handleAlbumList = async () => {
    try {
      setLoading(true);
      if (pick_group === '전체') {
        CameraRoll.getPhotos({
          first: pick_group === '전체' ? PHOTO_COUTN : PHOTO_COUTN,
          assetType: 'Photos',
        })
          .then(r => {
            setLoading(false);
            setImage(r?.edges);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);

            //Error Loading Images
          });
      } else {
        CameraRoll.getPhotos({
          first: pick_group === '전체' ? PHOTO_COUTN : pick_count,
          assetType: 'Photos',
          groupTypes: 'Album',
          groupName: pick_group,
        })
          .then(r => {
            setLoading(false);
            setImage(r?.edges);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);

            //Error Loading Images
          });
      }
    } catch (error) {
      setLoading(false);
      console.log('error ::: ', error);
    }
  };

  useEffect(() => {
    _handleAlbumArray();
    setLoading(false);
  }, []);

  //바꼈을때
  useEffect(() => {
    _handleAlbumList();
  }, [pick_group]);

  // hooks
  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#b2b2b2'}}>
      <View
        onStartShouldSetResponder={async () => {
          await setPick_count(group_name[0].count);
          await setTimeout(() => {
            setPick_group(group_name[0].title);
          }, 500);
          setChoise_imasge(final_image);
          setOpen(false);
        }}
        style={styles.container}>
        <View>
          <Text>사진 랜더링후 불러오기 삽질중 하하</Text>
        </View>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Text>바톰 오픈</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text>카톡 이미지 리스트 처럼 만든애 오픈</Text>
        </TouchableOpacity>
        <View>
          <Text>이미지 나열 하하하하 </Text>
        </View>
        <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
          {final_image.map((item, index) => {
            return (
              <View
                key={index}
                onPress={() => console.log(item)}
                style={{
                  width: Dimensions.get('window').width * 0.32,
                  height: 120,
                  marginTop: 10,
                  marginLeft: Dimensions.get('window').width * 0.01,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                  source={{uri: item.uri}}
                />
              </View>
            );
          })}
        </View>
        <ModalPhotoBottomSheet
          sheetRef={sheetRef}
          choise_imasge={choise_imasge}
          group_name={group_name}
          pick_group={pick_group}
          final_image={final_image}
          setPick_group={setPick_group}
          setChoise_imasge={setChoise_imasge}
          setFinal_image={setFinal_image}
          data={image}
          snapPoints={snapPoints}
          numColumns={3}
          loading={loading}
          setPick_count={setPick_count}
        />
      </View>
      {/* 하단에 생기게 하는 요소 example  */}
      <BottomPhotoFlatList
        open={true}
        choise_imasge={choise_imasge}
        group_name={group_name}
        pick_group={pick_group}
        final_image={final_image}
        setPick_group={setPick_group}
        setChoise_imasge={setChoise_imasge}
        setFinal_image={setFinal_image}
        data={image}
        snapPoints={snapPoints}
        numColumns={3}
        loading={loading}
        setPick_count={setPick_count}
        setOpen={setOpen}
        open={open}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});

export default Photo_List;
